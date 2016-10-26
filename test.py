import pyscreenshot as ImageGrab
import numpy as np
import pyautogui as pg
import time
#if __name__ == "__main__":

# grab the image
x = 1140
y = 140
img = ImageGrab.grab(bbox=(x,y,x+600,y+150))

pg.click(1443, 226)

while True:
    time.sleep(1)
    pg.press(' ')
