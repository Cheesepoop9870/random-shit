import re

quote = input("Enter quote to fix: ")
pagenum = input("Enter page number (opional): ")
quote = re.sub(r"\r|\n","", quote) #remove newlines and carriage returns
quote = re.sub(r"“|”|\x22", "\x27", quote) 

print("\n\x22"+quote+(f" ({pagenum})" if pagenum else "")+"\x22")
