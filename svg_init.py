## This program is used for converting SVG:s exported from Affinity designer to JSX
import os;

# Constants
folder = "./src/icons/";

# Walkdir
for file in os.listdir(folder):
    if file.endswith(".svg"):
        
        # Read file
        f = open(folder + file, "r");
        lines = f.readlines();
        f.close();

        # Write file
        f = open(folder + file, "w");
        for line in lines:
            if line.startswith("<!DOCTYPE"):
                line = "";
            
            # Replace xmlns:xlink with xmlnsXlink, xlink:href with xlinkHref, xlink:space with xlinkSpace and xlink:serif with xlinkSerif
            line = line.replace("xmlns:xlink", "xmlnsXlink");
            line = line.replace("xlink:href", "xlinkHref");
            line = line.replace("xml:space", "xmlSpace");
            line = line.replace("xmlns:serif", "xmlnsSerif");
            f.write(line);
        f.close();




