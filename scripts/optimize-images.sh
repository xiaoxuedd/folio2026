#!/bin/bash

# Image Optimization Script
# Converts large images to web-optimized versions in multiple sizes

SOURCE_DIR="/Users/maxcobb/Documents/Bitbucket/unknown/portfolio-club/2025 home image"
OUTPUT_DIR="/Users/maxcobb/Documents/Bitbucket/unknown/portfolio-club/public/images/projects"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🖼️  Optimizing images for web..."
echo "Source: $SOURCE_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Process images one by one
process_image() {
    local source_file="$1"
    local project_name="$2"
    local input_path="$SOURCE_DIR/$source_file"

    if [ ! -f "$input_path" ]; then
        echo "⚠️  Skipping $source_file (not found)"
        return
    fi

    echo "Processing: $project_name"

    # Card size (800x600 for project cards)
    echo "  → Creating card size (800x600)..."
    convertImage "$input_path" \
        -s 800x600^ \
        -c 800x600+0+0 \
        -g center \
        -q 85 \
        -e jpg \
        -o "$OUTPUT_DIR" > /dev/null 2>&1

    # Rename to project name
    latest_output=$(ls -t "$OUTPUT_DIR"/output/*.jpg 2>/dev/null | head -1)
    if [ -f "$latest_output" ]; then
        mv "$latest_output" "$OUTPUT_DIR/${project_name}.jpg"
        echo "  ✓ Card: ${project_name}.jpg ($(du -h "$OUTPUT_DIR/${project_name}.jpg" | cut -f1))"
    fi

    # Large size for header/hero (1200x800)
    echo "  → Creating large size (1200x800)..."
    convertImage "$input_path" \
        -s 1200x800^ \
        -c 1200x800+0+0 \
        -g center \
        -q 85 \
        -e jpg \
        -o "$OUTPUT_DIR" > /dev/null 2>&1

    latest_output=$(ls -t "$OUTPUT_DIR"/output/*.jpg 2>/dev/null | head -1)
    if [ -f "$latest_output" ]; then
        mv "$latest_output" "$OUTPUT_DIR/${project_name}-large.jpg"
        echo "  ✓ Large: ${project_name}-large.jpg ($(du -h "$OUTPUT_DIR/${project_name}-large.jpg" | cut -f1))"
    fi

    # Thumbnail (400x300 for fast loading)
    echo "  → Creating thumbnail (400x300)..."
    convertImage "$input_path" \
        -s 400x300^ \
        -c 400x300+0+0 \
        -g center \
        -q 80 \
        -e jpg \
        -o "$OUTPUT_DIR" > /dev/null 2>&1

    latest_output=$(ls -t "$OUTPUT_DIR"/output/*.jpg 2>/dev/null | head -1)
    if [ -f "$latest_output" ]; then
        mv "$latest_output" "$OUTPUT_DIR/${project_name}-thumb.jpg"
        echo "  ✓ Thumb: ${project_name}-thumb.jpg ($(du -h "$OUTPUT_DIR/${project_name}-thumb.jpg" | cut -f1))"
    fi

    echo ""
}

# Process each project image
process_image "national-cancer-institute-BxXgTQEw1M4-unsplash.jpg" "healthcare-precision-medicine"
process_image "claudio-schwarz-q8kR_ie6WnI-unsplash.jpg" "ecommerce-returns"
process_image "erik-mclean-3WAMh1omVAY-unsplash.jpg" "automobile-dealership"
process_image "towfiqu-barbhuiya-nApaSgkzaxg-unsplash.jpg" "finance-lending"

# Clean up output directory if it exists
rm -rf "$OUTPUT_DIR/output"

echo "✅ Optimization complete!"
echo ""
echo "📊 Final Results:"
echo "Total size: $(du -sh "$OUTPUT_DIR" | cut -f1)"
echo ""
echo "Files created:"
ls -lh "$OUTPUT_DIR"/*.jpg 2>/dev/null | awk '{printf "  %-40s %s\n", $9, $5}'
