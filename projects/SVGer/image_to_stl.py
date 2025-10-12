#!/usr/bin/env python3
"""
Image to STL Converter for Assyrian Relief 3D Printing
Complete pipeline: Image -> Processing -> Vectorization -> 3D Extrusion -> STL
"""

import cv2
import numpy as np
import subprocess
import trimesh
import argparse
import sys
import os
from pathlib import Path


class ImageToSTLConverter:
    """Converts relief images to 3D-printable STL files."""
    
    def __init__(self, image_path, output_name="assyrian_relief", 
                 blur_kernel=5, threshold_value=127, extrusion_height=5.0, 
                 turdsize=2, base_height=2.0):
        """
        Initialize converter with processing parameters.
        
        Args:
            image_path: Path to input image
            output_name: Base name for output files (default: "assyrian_relief")
            blur_kernel: Gaussian blur kernel size (default: 5)
            threshold_value: Binary threshold value 0-255 (default: 127)
            extrusion_height: Height of 3D extrusion in mm (default: 5.0)
            turdsize: Potrace noise suppression parameter (default: 2)
            base_height: Optional base height in mm (default: 2.0, 0 for no base)
        """
        self.image_path = Path(image_path)
        self.output_name = output_name
        self.blur_kernel = blur_kernel
        self.threshold_value = threshold_value
        self.extrusion_height = extrusion_height
        self.turdsize = turdsize
        self.base_height = base_height
        
        # Check if image exists
        if not self.image_path.exists():
            raise FileNotFoundError(f"Image not found: {self.image_path}")
    
    def stage1_preprocess_image(self):
        """
        Stage 1: Image preprocessing with OpenCV.
        Returns path to processed image.
        """
        print("\n=== Stage 1: Image Preprocessing ===")
        
        # Load image
        print(f"Loading image: {self.image_path}")
        image = cv2.imread(str(self.image_path))
        if image is None:
            raise ValueError(f"Could not load image: {self.image_path}")
        
        print(f"Image size: {image.shape[1]}x{image.shape[0]}")
        
        # Convert to grayscale
        print("Converting to grayscale...")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to smooth stone texture
        print(f"Applying Gaussian blur (kernel={self.blur_kernel}x{self.blur_kernel})...")
        blurred = cv2.GaussianBlur(gray, (self.blur_kernel, self.blur_kernel), 0)
        
        # Apply binary threshold to create black and white image
        print(f"Applying binary threshold (value={self.threshold_value})...")
        _, threshold = cv2.threshold(blurred, self.threshold_value, 255, cv2.THRESH_BINARY)
        
        # Save processed image as PBM (potrace requires PNM format)
        temp_path = Path("temp_processed.pbm")
        cv2.imwrite(str(temp_path), threshold)
        print(f"Saved preprocessed image: {temp_path}")
        
        return temp_path
    
    def stage2_vectorize(self, processed_image_path):
        """
        Stage 2: Vectorization with potrace.
        Returns path to SVG file.
        """
        print("\n=== Stage 2: Vectorization with potrace ===")
        
        svg_path = Path(f"{self.output_name}.svg")
        
        # Build potrace command
        command = [
            "potrace",
            str(processed_image_path),
            "-s",  # SVG output
            "-o", str(svg_path),
            "-t", str(self.turdsize),  # Noise suppression
        ]
        
        print(f"Running: {' '.join(command)}")
        
        try:
            subprocess.run(command, check=True, capture_output=True, text=True)
            print(f"✓ SVG created: {svg_path}")
            return svg_path
        except subprocess.CalledProcessError as e:
            print(f"Error: potrace command failed")
            print(f"stderr: {e.stderr}")
            raise RuntimeError("potrace failed. Make sure it's installed: brew install potrace")
        except FileNotFoundError:
            raise RuntimeError("potrace not found. Install it with: brew install potrace")
    
    def stage3_extrude_to_3d(self, svg_path):
        """
        Stage 3: Load SVG and extrude to 3D mesh.
        Returns trimesh object.
        """
        print("\n=== Stage 3: 3D Extrusion ===")
        
        # Load SVG path
        print(f"Loading SVG: {svg_path}")
        try:
            path_2d = trimesh.load_path(str(svg_path))
        except Exception as e:
            raise RuntimeError(f"Failed to load SVG: {e}")
        
        print(f"Found {len(path_2d.entities)} path entities")
        
        # Extrude the 2D path to 3D
        print(f"Extruding to height: {self.extrusion_height}mm")
        try:
            extruded = path_2d.extrude(height=self.extrusion_height)
            
            # extrude returns a list of meshes if there are multiple paths
            if isinstance(extruded, list):
                print(f"Got {len(extruded)} mesh segments, combining...")
                relief_mesh = trimesh.util.concatenate(extruded)
            else:
                relief_mesh = extruded
        except Exception as e:
            raise RuntimeError(f"Failed to extrude: {e}")
        
        print(f"Created mesh with {len(relief_mesh.vertices)} vertices, {len(relief_mesh.faces)} faces")
        
        # Optionally add a base
        if self.base_height > 0:
            print(f"\nAdding base (height={self.base_height}mm)...")
            
            # Get bounding box of relief
            bounds = relief_mesh.bounds
            width = bounds[1][0] - bounds[0][0]
            depth = bounds[1][1] - bounds[0][1]
            
            # Create base box
            base_mesh = trimesh.primitives.Box(
                extents=[width, depth, self.base_height]
            )
            
            # Position base below relief
            base_mesh.apply_translation([
                (bounds[0][0] + bounds[1][0]) / 2,
                (bounds[0][1] + bounds[1][1]) / 2,
                -self.base_height / 2
            ])
            
            # Combine meshes
            print("Combining relief and base...")
            try:
                final_mesh = trimesh.util.concatenate([relief_mesh, base_mesh])
                print(f"Final mesh: {len(final_mesh.vertices)} vertices, {len(final_mesh.faces)} faces")
                return final_mesh
            except:
                print("Warning: Could not union meshes, using concatenation")
                return trimesh.util.concatenate([relief_mesh, base_mesh])
        
        return relief_mesh
    
    def stage4_export_stl(self, mesh):
        """
        Stage 4: Export mesh to STL file.
        Returns path to STL file.
        """
        print("\n=== Stage 4: STL Export ===")
        
        stl_path = Path(f"{self.output_name}.stl")
        
        print(f"Exporting to: {stl_path}")
        mesh.export(str(stl_path))
        
        file_size = stl_path.stat().st_size / 1024  # KB
        print(f"✓ STL file created: {stl_path} ({file_size:.1f} KB)")
        
        return stl_path
    
    def cleanup_temp_files(self):
        """Remove temporary files."""
        temp_files = ["temp_processed.pbm", "temp_processed.png"]
        for temp_file in temp_files:
            temp_path = Path(temp_file)
            if temp_path.exists():
                temp_path.unlink()
                print(f"Cleaned up: {temp_file}")
    
    def convert(self):
        """Run the complete conversion pipeline."""
        print("=" * 60)
        print("IMAGE TO STL CONVERTER - Assyrian Relief 3D Printing")
        print("=" * 60)
        
        try:
            # Stage 1: Preprocess image
            processed_image = self.stage1_preprocess_image()
            
            # Stage 2: Vectorize with potrace
            svg_file = self.stage2_vectorize(processed_image)
            
            # Stage 3: Extrude to 3D
            mesh = self.stage3_extrude_to_3d(svg_file)
            
            # Stage 4: Export STL
            stl_file = self.stage4_export_stl(mesh)
            
            # Cleanup
            print("\n=== Cleanup ===")
            self.cleanup_temp_files()
            
            # Success summary
            print("\n" + "=" * 60)
            print("✓ CONVERSION COMPLETE!")
            print("=" * 60)
            print(f"Output files:")
            print(f"  - SVG: {svg_file}")
            print(f"  - STL: {stl_file}")
            print(f"\nYou can now 3D print the STL file!")
            
            return stl_file
            
        except Exception as e:
            print(f"\n❌ Error: {e}", file=sys.stderr)
            self.cleanup_temp_files()
            sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description='Convert relief images to 3D-printable STL files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic conversion
  python3 image_to_stl.py Example.png
  
  # Adjust threshold for more/less detail
  python3 image_to_stl.py Example.png -t 100
  
  # Taller extrusion
  python3 image_to_stl.py Example.png -e 10
  
  # More blur for simpler shapes
  python3 image_to_stl.py Example.png -b 9
  
  # Without base
  python3 image_to_stl.py Example.png --no-base
        """
    )
    
    parser.add_argument('input', help='Input image file (PNG, JPG, etc.)')
    parser.add_argument('-o', '--output', default='assyrian_relief', 
                       help='Output file basename (default: assyrian_relief)')
    parser.add_argument('-b', '--blur', type=int, default=5, 
                       help='Gaussian blur kernel size (default: 5)')
    parser.add_argument('-t', '--threshold', type=int, default=127, 
                       help='Binary threshold value 0-255 (default: 127)')
    parser.add_argument('-e', '--extrusion', type=float, default=5.0, 
                       help='Extrusion height in mm (default: 5.0)')
    parser.add_argument('-s', '--turdsize', type=int, default=2, 
                       help='Potrace noise suppression (default: 2)')
    parser.add_argument('--base', type=float, default=2.0, 
                       help='Base height in mm (default: 2.0)')
    parser.add_argument('--no-base', action='store_true', 
                       help='Skip adding base')
    
    args = parser.parse_args()
    
    # Adjust base height if no-base is set
    base_height = 0 if args.no_base else args.base
    
    # Create converter and run
    converter = ImageToSTLConverter(
        image_path=args.input,
        output_name=args.output,
        blur_kernel=args.blur,
        threshold_value=args.threshold,
        extrusion_height=args.extrusion,
        turdsize=args.turdsize,
        base_height=base_height
    )
    
    converter.convert()


if __name__ == '__main__':
    main()
