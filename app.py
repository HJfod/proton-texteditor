import tkinter as tk
from tkinter import filedialog, Text
import os

button_width = 40
g_fs = 0

root = tk.Tk()
root.geometry('500x300')
root.title('app')
root.configure(bg='#000')

def hover_e(e):
	e.widget.configure(bg='#444')

def hover_l(e):
	e.widget.configure(bg='#000')

def fullscreen():
	root.update()

def switchfs(s):
	if (s == 0):
		gf_s = 1
		confg()
	else:
		gf_s = 0
		confg()

def confg(e = 0):
	root.attributes('-fullscreen','%(b)d' % {'b': g_fs})

#canvas = tk.Canvas(root, height=300, width=500, bg="#000000")
#canvas.pack()

#menubar = tk.Menu(root)
#filemenu = tk.Menu(menubar, tearoff=0)
#filemenu.add_command(label="New", command=donothing)
#filemenu.add_command(label="Open", command=donothing)
#filemenu.add_command(label="Save", command=donothing)
#filemenu.add_separator()
#filemenu.add_command(label="Exit", command=root.quit)
#menubar.add_cascade(label="File", menu=filemenu)

root.update()

class app:
	b_exit = tk.Button(root, text='✕', font=('Roboto Lt',12,'normal'), border=0, padx=5, pady=20, fg="#fff", bg="#000", activebackground='#f00', activeforeground='#fff', command=root.quit)
	b_exit.place(width = button_width, height=25, x = root.winfo_width()-button_width, y = 0)
	b_exit.bind('<Enter>', hover_e)
	b_exit.bind('<Leave>', hover_l)
	
	b_fs = tk.Button(root, text='☐', font=('Roboto Lt',12,'normal'), border=0, padx=5, pady=20, fg="#fff", bg="#000", activebackground='#66c', activeforeground='#fff', command=switchfs(g_fs))
	b_fs.place(width = button_width, height=25, x = root.winfo_width()-button_width*2, y = 0)
	b_fs.bind('<Enter>', hover_e)
	b_fs.bind('<Leave>', hover_l)

root.bind('<Configure>', confg)

#root.config(menu=menubar)

root.overrideredirect(1)
root.mainloop()

