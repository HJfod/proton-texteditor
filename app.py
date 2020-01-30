import tkinter as tk
from tkinter import filedialog, Text
import os

root = tk.Tk()

#canvas = tk.Canvas(root, height=500, width=700, bg="#aa00ff")
#canvas.pack()

def donothing():
    x = 0

menubar = tk.Menu(root)
filemenu = tk.Menu(menubar, tearoff=0)
filemenu.add_command(label="New", command=donothing)
filemenu.add_command(label="Open", command=donothing)
filemenu.add_command(label="Save", command=donothing)
filemenu.add_separator()
filemenu.add_command(label="Exit", command=root.quit)
menubar.add_cascade(label="File", menu=filemenu)

button = tk.Button(root, text="this a button bro", font=("Comic Sans MS",20,"normal"), border=0, padx=5, pady=20, fg="#00f", bg="#00ff00")
button.pack()

root.config(menu=menubar)
root.mainloop()

