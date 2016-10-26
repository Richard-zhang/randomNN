from PIL import Image
import pyscreenshot as ImageGrab
import numpy as np
import pyautogui as pg
import time
#if __name__ == "__main__":

# grab the image
x = 1140
y = 140
img = ImageGrab.grab(bbox=(x,y,x+600,y+150))
pix = img.load()

x_origin = 53
y_origin = 120
safe_distance = 70

print pix[53, 120]

pg.click(1443,226)
pg.press(' ')
while True:
    time.sleep(0.01)
    img = ImageGrab.grab(bbox=(x,y,x+600, y+150))
    pix = img.load()
    first = pix[x_origin+safe_distance, y_origin][0] != 247
    second = pix[x_origin+safe_distance-10, y_origin][0] != 247
    third = pix[x_origin+safe_distance+10, y_origin][0] != 247
    stop = pix[295, 83][0] == 83
    if (first or second or third):
        pg.press(' ')
