import os
from PIL import Image

def convert_images_to_webp(source_folder):
    webp_files = {}
    for root, _, files in os.walk(source_folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                file_path = os.path.join(root, file)
                img = Image.open(file_path)
                webp_file_name = f"{os.path.splitext(file)[0]}@{img.width}x{img.height}.webp"
                webp_file_path = os.path.join(root, webp_file_name)
                img.save(webp_file_path, 'webp')
                webp_files[file_path] = webp_file_path
                print(f"Converted {file_path} to {webp_file_path}")
    return webp_files

def update_md_files(md_folder, webp_files):
    for root, _, files in os.walk(md_folder):
        for file in files:
            if file.lower().endswith('.md'):
                md_file_path = os.path.join(root, file)
                with open(md_file_path, 'r', encoding='utf-8') as md_file:
                    content = md_file.read()
                updated_content = content
                for original_path, webp_path in webp_files.items():
                    original_file_name = os.path.basename(original_path)
                    webp_file_name = os.path.basename(webp_path)
                    folder_name = os.path.basename(os.path.dirname(original_path))
                    new_webp_path = f"./blog/{folder_name}/{webp_file_name}"
                    updated_content = updated_content.replace(original_file_name, new_webp_path)
                with open(md_file_path, 'w', encoding='utf-8') as md_file:
                    md_file.write(updated_content)
                print(f"Updated {md_file_path}")

if __name__ == "__main__":
    source_folder = "./"  # 图片所在文件夹
    md_folder = "./../_posts"  # Markdown文件所在文件夹
    webp_files = convert_images_to_webp(source_folder)
    update_md_files(md_folder, webp_files)