from Tkinter import *
from PIL import Image, ImageTk

imgFolder = './img/png/'

def placePiece(app, name, x, y):
    background_image=PhotoImage(file=imgFolder+name+'.gif')
    background_label = Label(app, image=background_image)
    background_label.place(x=x, y=y)
    background_label.pack() 




def main():
    app = Tk()
    app.geometry('{}x{}'.format(700, 712))
    app.title('Chinese Chess AI - CS221 Project')
    app.resizable(False, False)
    #background_image=PhotoImage(Image.open('./img/png/board.png'))
    background_image=PhotoImage(file='./img/board.gif')
    background_label = Label(app, image=background_image)
    background_label.place(x=0, y=0, relwidth=1, relheight=1)

    ##placePiece(app, 'rs', 50,15)
    #
    #background_image2=PhotoImage(Image.open(imgFolder+'bs'+'.png'))
    #background_label2 = Label(app, image=background_image2)
    #background_label2.place(x=50, y=15)
    app.mainloop()


if __name__ == '__main__':
    main()  
