import os
from PIL import Image
import re

def convert_images_to_jpg(source_dir, target_dir, quality=60, scale_factor=0.8):
    for root, _, files in os.walk(source_dir):
        for file in files:
            print(f"- Selected file: {file}")
            if '_compressed.jpg' in file.lower():
                print(f"~  |- Skip compressed file: {file}")
                continue
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                img_path = os.path.join(root, file)
                img = Image.open(img_path)
                if img.mode in ('RGBA', 'P'): 
                    img = img.convert('RGB')
                    print(f"~  |- Converted {img_path} to RGB")
                
                # 计算新的尺寸
                new_width = int(img.width * scale_factor)
                new_height = int(img.height * scale_factor)
                img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                jpg_path = os.path.join(target_dir, os.path.relpath(root, source_dir), 
                                      f"{os.path.splitext(file)[0]}_compressed.jpg")
                os.makedirs(os.path.dirname(jpg_path), exist_ok=True)
                
                # 先保存到临时文件以比较大小
                temp_path = jpg_path + '.temp'
                img_resized.save(temp_path, 'JPEG', quality=quality)
                
                # 比较文件大小
                original_size = os.path.getsize(img_path)
                compressed_size = os.path.getsize(temp_path)
                print(f"~  |- Original size: {original_size} Bytes, Compressed size: {compressed_size} Bytes")
                if compressed_size < original_size:
                    os.replace(temp_path, jpg_path)
                    print(f"-  |- Compressed {img_path} to {jpg_path}")
                    yield img_path, jpg_path
                else:
                    os.remove(temp_path)
                    # 如果压缩后反而更大，则直接复制原文件
                    if not os.path.exists(jpg_path):
                        img.save(jpg_path, quality=95)
                    print(f"~  |- Skipped {img_path} as it's already compressed")
                    yield img_path, jpg_path
    print("- Picture Zip Completed!")

def update_md_files(md_dir, img_dir):
    for root, _, files in os.walk(md_dir):
        for file in files:
            if file.lower().endswith('.md'):
                print(f"- Selected file: {file}")
                md_path = os.path.join(root, file)
                with open(md_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                blog_name = os.path.splitext(file)[0]
                blog_img_dir = os.path.join(img_dir, blog_name)
                if not os.path.exists(blog_img_dir):
                    print(f"~ Image directory not found: {blog_img_dir}, skipped!")
                    continue

                for img_file in os.listdir(blog_img_dir):
                    if '_compressed.jpg' in img_file.lower():
                        continue
                    if img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                        print(f"-  |- Found {img_file}, updating ...")
                        base_name = os.path.splitext(img_file)[0]
                        compressed_jpg = f"{base_name}_compressed.jpg"
                        if os.path.exists(os.path.join(blog_img_dir, compressed_jpg)):
                            print(f"?  |- Already compressed: {compressed_jpg}, skipped!")
                            content = re.sub(re.escape(img_file), compressed_jpg, content)

                with open(md_path, 'w', encoding='utf-8') as f:
                    print(f"-  |- Saving {md_path} ...")
                    f.write(content)
                    
                print(f"- Updated {md_path}.")
    print("- Markdown Update Completed!")

def main():
    if os.name == 'nt':  # Windows
        source_images_dir = 'source\\images\\blog'
        target_images_dir = 'source\\images\\blog'
        md_files_dir = 'source\\_posts'
    else:
        source_images_dir = 'source/images/blog'
        target_images_dir = 'source/images/blog'
        md_files_dir = 'source/_posts'

    img_mappings = {}
    for old_path, new_path in convert_images_to_jpg(source_images_dir, target_images_dir):
        img_mappings[old_path] = new_path

    update_md_files(md_files_dir, source_images_dir)

if __name__ == '__main__':
    main()