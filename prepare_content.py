#!/usr/bin/env python3
"""Split combined markdown files and copy individual ones into content/ directory."""
import os
import re
import json

CONTENT_SRC = "/home/user/workspace/course_content"
CONTENT_DST = "/home/user/workspace/course-preview-v2/content"

os.makedirs(CONTENT_DST, exist_ok=True)

# Copy individual files directly
individual_files = {
    "module_1.md": "v2_module_1_foundation.md",
    "module_2_beginner.md": "v2_module_2_beginner.md",
    "module_3_intermediate.md": "v2_module_3_intermediate.md",
    "module_7_beginner.md": "v2_module_7_beginner.md",
    "module_7_intermediate.md": "v2_module_7_intermediate.md",
    "glossary.md": "v2_ai_glossary.md",
}

for dst_name, src_name in individual_files.items():
    src_path = os.path.join(CONTENT_SRC, src_name)
    dst_path = os.path.join(CONTENT_DST, dst_name)
    with open(src_path, 'r') as f:
        content = f.read()
    with open(dst_path, 'w') as f:
        f.write(content)
    print(f"Copied {src_name} -> {dst_name} ({len(content)} bytes)")

# Split combined beginner 4-5-6
def split_modules(src_file, module_headers, output_names):
    src_path = os.path.join(CONTENT_SRC, src_file)
    with open(src_path, 'r') as f:
        lines = f.readlines()
    
    # Find line numbers for each module header
    splits = []
    for i, line in enumerate(lines):
        for header in module_headers:
            if line.strip().startswith(header):
                splits.append(i)
                break
    
    splits.append(len(lines))
    
    for idx, name in enumerate(output_names):
        start = splits[idx]
        end = splits[idx + 1] if idx + 1 < len(splits) else len(lines)
        content = ''.join(lines[start:end])
        dst_path = os.path.join(CONTENT_DST, name)
        with open(dst_path, 'w') as f:
            f.write(content)
        print(f"Split {src_file} -> {name} ({len(content)} bytes, lines {start}-{end})")

# Split beginner 4-5-6
split_modules(
    "v2_modules_4_5_6_beginner.md",
    ["# MODULE 4", "# MODULE 5", "# MODULE 6"],
    ["module_4_beginner.md", "module_5_beginner.md", "module_6_beginner.md"]
)

# Split intermediate 4-5-6
split_modules(
    "v2_modules_4_5_6_intermediate.md",
    ["# MODULE 4", "# MODULE 5", "# MODULE 6"],
    ["module_4_intermediate.md", "module_5_intermediate.md", "module_6_intermediate.md"]
)

# Verify all files
print("\n--- All content files ---")
for f in sorted(os.listdir(CONTENT_DST)):
    size = os.path.getsize(os.path.join(CONTENT_DST, f))
    print(f"  {f}: {size:,} bytes")
