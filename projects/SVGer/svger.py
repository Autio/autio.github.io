#!/usr/bin/env python3
"""
SVGer - Image to 3D-Printable SVG Converter
Converts images (like Assyrian reliefs) into simplified SVG files optimized for 3D printing.
"""

import cv2
import numpy as np
from pathlib import Path
import argparse
import sys


class SVGConverter:
    """Converts images to 3D-printable SVG files with depth layers."""
    
    def __init__(self, image_path, output_path=None, num_layers=5, simplify_tolerance=2.0, 
                 edge_threshold1=50, edge_threshold2=150, invert=False, skip_edges=False):
        """
        Initialize the SVG converter.
        
        Args:
            image_path: Path to input image
            output_path: Path for output SVG (default: input_name_relief.svg)
            num_layers: Number of depth layers for relief (default: 5)
            simplify_tolerance: Contour simplification tolerance (default: 2.0)
            edge_threshold1: Lower threshold for Canny edge detection (default: 50)
            edge_threshold2: Upper threshold for Canny edge detection (default: 150)
            invert: Invert depth mapping (default: False)
            skip_edges: Skip edge detection layer, use only depth layers (default: False)
        """
        self.image_path = Path(image_path)
        self.output_path = Path(output_path) if output_path else self.image_path.with_name(
            f"{self.image_path.stem}_relief.svg"
        )
        self.num_layers = num_layers
        self.simplify_tolerance = simplify_tolerance
        self.edge_threshold1 = edge_threshold1
        self.edge_threshold2 = edge_threshold2
        self.invert = invert
        self.skip_edges = skip_edges
        
        # Load and process image
        self.image = cv2.imread(str(self.image_path))
        if self.image is None:
            raise ValueError(f"Could not load image: {self.image_path}")
        
        self.height, self.width = self.image.shape[:2]
        self.gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        
    def detect_edges(self):
        """Detect edges in the image using multiple aggressive methods."""
        # Enhance contrast first
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(self.gray)
        
        # Method 1: Very sensitive Canny edge detection
        blurred = cv2.GaussianBlur(enhanced, (3, 3), 0)
        canny1 = cv2.Canny(blurred, 20, 60)  # More sensitive
        canny2 = cv2.Canny(blurred, self.edge_threshold1, self.edge_threshold2)
        
        # Method 2: Adaptive thresholding for texture details
        adaptive = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                        cv2.THRESH_BINARY_INV, 15, 3)
        
        # Method 3: Multiple morphological gradients at different scales
        kernel_small = np.ones((2, 2), np.uint8)
        kernel_med = np.ones((3, 3), np.uint8)
        kernel_large = np.ones((5, 5), np.uint8)
        
        gradient1 = cv2.morphologyEx(enhanced, cv2.MORPH_GRADIENT, kernel_small)
        gradient2 = cv2.morphologyEx(enhanced, cv2.MORPH_GRADIENT, kernel_med)
        gradient3 = cv2.morphologyEx(enhanced, cv2.MORPH_GRADIENT, kernel_large)
        
        _, grad_thresh1 = cv2.threshold(gradient1, 5, 255, cv2.THRESH_BINARY)
        _, grad_thresh2 = cv2.threshold(gradient2, 8, 255, cv2.THRESH_BINARY)
        _, grad_thresh3 = cv2.threshold(gradient3, 10, 255, cv2.THRESH_BINARY)
        
        # Method 4: Sobel edge detection
        sobelx = cv2.Sobel(enhanced, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(enhanced, cv2.CV_64F, 0, 1, ksize=3)
        sobel = np.sqrt(sobelx**2 + sobely**2)
        sobel = np.uint8(255 * sobel / np.max(sobel))
        _, sobel_thresh = cv2.threshold(sobel, 20, 255, cv2.THRESH_BINARY)
        
        # Combine all edge detection methods
        edges = cv2.bitwise_or(canny1, canny2)
        edges = cv2.bitwise_or(edges, adaptive)
        edges = cv2.bitwise_or(edges, grad_thresh1)
        edges = cv2.bitwise_or(edges, grad_thresh2)
        edges = cv2.bitwise_or(edges, grad_thresh3)
        edges = cv2.bitwise_or(edges, sobel_thresh)
        
        # Minimal cleanup to avoid merging separate features
        edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel_small, iterations=1)
        
        return edges
    
    def create_depth_layers(self):
        """
        Create filled silhouettes at different brightness levels.
        Returns list of (depth_value, contours) tuples.
        """
        # Enhance contrast
        clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(self.gray)
        
        # Invert so carved (darker) areas become bright
        inverted = 255 - enhanced
        
        # Blur to reduce noise and create smoother regions
        blurred = cv2.GaussianBlur(inverted, (9, 9), 0)
        
        print(f"  Creating {self.num_layers} depth layers from intensity levels...")
        
        layers = []
        
        # Create layers at evenly spaced intensity thresholds
        # Skip very low thresholds that just capture the entire background
        for i in range(self.num_layers):
            # Threshold value for this layer - start higher to skip background
            threshold_val = int(80 + (i * (175 / self.num_layers)))
            
            # Create binary mask at this threshold
            _, binary = cv2.threshold(blurred, threshold_val, 255, cv2.THRESH_BINARY)
            
            # Connect nearby regions to form complete figures
            kernel = np.ones((7, 7), np.uint8)
            binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=4)
            binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=2)
            
            # Dilate slightly to make figures more solid
            binary = cv2.dilate(binary, kernel, iterations=1)
            
            # Find contours
            contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            layer_contours = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 800:  # Only substantial regions
                    perimeter = cv2.arcLength(contour, True)
                    # Light simplification to preserve recognizable shapes
                    epsilon = self.simplify_tolerance * 0.003 * perimeter
                    approx = cv2.approxPolyDP(contour, epsilon, True)
                    if len(approx) >= 3:
                        layer_contours.append(approx)
            
            depth_mm = (i + 1) * (5.0 / self.num_layers)
            layers.append((int((i + 1) * (255 / self.num_layers)), layer_contours))
            print(f"  Layer {i+1}: {len(layer_contours)} filled regions at depth {depth_mm:.2f}mm")
        
        return layers
    
    def extract_outline_contours(self):
        """Extract main outline contours from edge detection."""
        edges = self.detect_edges()
        
        # Find contours from edges
        contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_TC89_L1)
        
        print(f"  Found {len(contours)} raw contours from edge detection")
        
        # Simplify and filter contours
        simplified_contours = []
        filtered_count = 0
        too_small = 0
        too_few_points = 0
        
        for contour in contours:
            area = cv2.contourArea(contour)
            perimeter = cv2.arcLength(contour, True)
            
            # Accept smaller contours to capture more detail
            if area > 20 or perimeter > 20:
                # Very gentle simplification to preserve detail
                epsilon = 0.003 * perimeter  
                approx = cv2.approxPolyDP(contour, epsilon, True)
                # Only keep contours with at least 3 points
                if len(approx) >= 3:
                    simplified_contours.append(approx)
                elif len(contour) >= 3:
                    # If simplification removed too many points, use original contour
                    simplified_contours.append(contour)
                else:
                    too_few_points += 1
            else:
                too_small += 1
        
        print(f"  Kept {len(simplified_contours)} contours (too small: {too_small}, too few points after simplification: {too_few_points})")
        
        return simplified_contours
    
    def contour_to_svg_path(self, contour):
        """Convert OpenCV contour to SVG path string."""
        if len(contour) < 3:
            return ""  # Need at least 3 points for a valid shape
        
        # Start path
        path_data = f"M {contour[0][0][0]},{contour[0][0][1]}"
        
        # Add line segments
        for point in contour[1:]:
            path_data += f" L {point[0][0]},{point[0][1]}"
        
        # Close path
        path_data += " Z"
        
        return path_data
    
    def generate_svg(self):
        """Generate the complete SVG file with depth layers and outlines."""
        print(f"Processing image: {self.image_path}")
        print(f"Image dimensions: {self.width}x{self.height}")
        
        # Extract depth layers
        print(f"Creating {self.num_layers} depth layers...")
        depth_layers = self.create_depth_layers()
        
        # Extract outline contours
        if not self.skip_edges:
            print("Extracting outline contours...")
            outline_contours = self.extract_outline_contours()
        else:
            print("Skipping edge detection (using depth layers only)...")
            outline_contours = []
        
        # Start building SVG
        svg_lines = [
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            f'<svg width="{self.width}" height="{self.height}" ',
            '     xmlns="http://www.w3.org/2000/svg" ',
            '     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape">',
            '',
            '  <!-- Generated by SVGer - Image to 3D-Printable SVG Converter -->',
            '  <!-- Depth layers represent relief height for 3D printing -->',
            '',
            '  <defs>',
            '    <!-- Each layer has a data-depth attribute for 3D printing -->',
            '  </defs>',
            ''
        ]
        
        # Add depth layers (back to front, darker to lighter)
        print("Generating depth layer paths...")
        for layer_idx, (threshold, contours) in enumerate(depth_layers):
            depth_mm = (layer_idx + 1) * (5.0 / self.num_layers)  # Scale to 5mm max relief
            
            # Create gradient from dark (deep/background) to light (raised/foreground)
            # Lower layers = darker (recessed), higher layers = lighter (raised)
            darkness = int(50 + (layer_idx / self.num_layers) * 150)  # Range: 50-200
            
            svg_lines.append(f'  <!-- Depth Layer {layer_idx + 1}: {depth_mm:.2f}mm relief -->')
            svg_lines.append(f'  <g id="depth-layer-{layer_idx + 1}" ')
            svg_lines.append(f'     inkscape:groupmode="layer" ')
            svg_lines.append(f'     inkscape:label="Depth {depth_mm:.2f}mm" ')
            svg_lines.append(f'     data-depth="{depth_mm:.2f}">')
            
            contour_count = 0
            for contour_idx, contour in enumerate(contours):
                path_data = self.contour_to_svg_path(contour)
                if path_data and "L" in path_data:  # Ensure path has actual line segments
                    svg_lines.append(f'    <path d="{path_data}" ')
                    svg_lines.append(f'          fill="rgb({darkness}, {darkness}, {darkness})" ')
                    svg_lines.append(f'          fill-opacity="1.0" ')
                    svg_lines.append(f'          stroke="rgb({min(darkness+40, 255)}, {min(darkness+40, 255)}, {min(darkness+40, 255)})" ')
                    svg_lines.append(f'          stroke-width="2" />')
                    contour_count += 1
            
            svg_lines.append('  </g>')
            svg_lines.append('')
        
        # Add outline layer on top
        print("Generating outline paths...")
        svg_lines.append('  <!-- Outline Layer: Main edges and details -->')
        svg_lines.append('  <g id="outline-layer" ')
        svg_lines.append('     inkscape:groupmode="layer" ')
        svg_lines.append('     inkscape:label="Outlines" ')
        svg_lines.append('     data-depth="5.0">')
        
        outline_count = 0
        for contour_idx, contour in enumerate(outline_contours):
            path_data = self.contour_to_svg_path(contour)
            if path_data and "L" in path_data:  # Ensure path has actual line segments
                svg_lines.append(f'    <path d="{path_data}" ')
                svg_lines.append(f'          fill="none" ')
                svg_lines.append(f'          stroke="black" ')
                svg_lines.append(f'          stroke-width="1.5" />')
                outline_count += 1
        
        svg_lines.append('  </g>')
        svg_lines.append('')
        svg_lines.append('</svg>')
        
        # Write SVG file
        svg_content = '\n'.join(svg_lines)
        self.output_path.write_text(svg_content)
        
        print(f"\n✓ SVG file created: {self.output_path}")
        print(f"  - Total depth layers: {self.num_layers}")
        print(f"  - Outline paths: {outline_count}")
        print(f"  - Max relief height: 5.0mm")
        print(f"  - Ready for 3D printing!")
        
        return self.output_path


def main():
    """Main entry point for command-line usage."""
    parser = argparse.ArgumentParser(
        description='SVGer - Convert images to 3D-printable SVG files with relief depth layers',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic conversion
  python svger.py Example.png
  
  # With custom output and more layers
  python svger.py Example.png -o output.svg -l 8
  
  # Adjust edge detection sensitivity
  python svger.py Example.png -e1 30 -e2 100
  
  # Invert depth (darker = higher)
  python svger.py Example.png --invert
        """
    )
    
    parser.add_argument('input', help='Input image file (PNG, JPG, etc.)')
    parser.add_argument('-o', '--output', help='Output SVG file path (default: input_name_relief.svg)')
    parser.add_argument('-l', '--layers', type=int, default=5, help='Number of depth layers (default: 5)')
    parser.add_argument('-s', '--simplify', type=float, default=2.0, help='Contour simplification tolerance (default: 2.0)')
    parser.add_argument('-e1', '--edge-threshold1', type=int, default=50, help='Lower Canny threshold (default: 50)')
    parser.add_argument('-e2', '--edge-threshold2', type=int, default=150, help='Upper Canny threshold (default: 150)')
    parser.add_argument('--invert', action='store_true', help='Invert depth mapping (darker = higher)')
    parser.add_argument('--skip-edges', action='store_true', help='Skip edge detection, use only depth layers')
    
    args = parser.parse_args()
    
    try:
        converter = SVGConverter(
            image_path=args.input,
            output_path=args.output,
            num_layers=args.layers,
            simplify_tolerance=args.simplify,
            edge_threshold1=args.edge_threshold1,
            edge_threshold2=args.edge_threshold2,
            invert=args.invert,
            skip_edges=args.skip_edges
        )
        
        converter.generate_svg()
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
