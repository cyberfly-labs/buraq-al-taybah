from PIL import Image, ImageChops

def remove_white_bg(img_path):
    img = Image.open(img_path).convert("RGBA")
    
    # getdata and replace white with transparent
    datas = img.getdata()
    newData = []
    
    # We will also find the bounding box of non-white pixels
    min_x, min_y = img.width, img.height
    max_x, max_y = 0, 0
    
    for y in range(img.height):
        for x in range(img.width):
            item = img.getpixel((x, y))
            # Treat near-white as transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    img.putdata(newData)
    
    # Crop to bounding box with a small padding
    padding = 10
    crop_box = (
        max(0, min_x - padding), 
        max(0, min_y - padding), 
        min(img.width, max_x + padding), 
        min(img.height, max_y + padding)
    )
    img_cropped = img.crop(crop_box)
    
    img_cropped.save(img_path, "PNG")
    print(f"Processed and cropped image. New size: {img_cropped.size}")

remove_white_bg('/Users/abu/buraqaltaybah/assets/logo.png')
