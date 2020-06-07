from PIL import Image

img = Image.open('image/map/map4.bmp')
img = img.convert('RGB')
pix = img.load()

pixel   = {}
first_y = 0
first_flag = True
line_black = 0
z_dim = 1
for y in range(img.size[1]):
    for x in range(img.size[0]):
        if pix[x,y] == (255,255,255): # ignore white
            continue
        elif pix[x,y] == (0,0,0): # black
            for xx in range(img.size[0]): # check all line
                if pix[xx,y] == (0,0,0):
                    line_black += 1
            if line_black == img.size[0]: # all line is black
                z_dim += 1
                first_flag = True
                break
            else:
                line_black = 0
        
        else:
            line_black = 0

        for px in pixel:
            if pix[x,y] == pixel[px][0]:
                if first_flag:
                    first_y = y # first pixel what counts
                    first_flag = False
                pixel[px][1].append([x,(y-first_y),z_dim])
                break
        else:
            pixel["tile_"+str(len(pixel.keys()))] = [pix[x,y],[]] # first appear


TILE_SIZE = 16 # temporary
with open("image/map/map4.txt", "w") as f: # "floor0,0,0,1\n"
    mapstr = ""
    for px in pixel:
        for coord in pixel[px][1]:
            mapstr += f"\"{px},{coord[0]*TILE_SIZE},{coord[1]*TILE_SIZE},{coord[2]}\\n\"+\n"
    f.write(mapstr[:-5] + "\";")