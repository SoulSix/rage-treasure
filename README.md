# ArcheRage Treasure Map Sorter

Plain JS tool to sort your treasure maps.

## How to use

### 1. Data preparation

Prepare your storage chest data to match a following pattern:

```
[
 ["row1 item1", "row1 item2", ... "row1 item10"],
 ["row2 item1", "row2 item2", ... "row2 item10"],
 ...
 ["row15 item1", "row15 item2", ... "row15 item10"]
]
```

In conclusion, your data must resemble a storage chest grid (up to 15 rows, up to 10 items per row)

### 2. Data import

1. Scroll down to the `"Import chunks"` section of the app
2. Copy-paste your data into one of the chunk text areas. Alternatively, if you have your data in a text file (JSON or
   TXT), drag and drop that file to the chunk text area
3. Click the corresponding `"Import Chunk #"` button

You could also import a full grid at once, provided you have the data for it (for example, exported by someone from this
app). To do so, paste the grid data in the text box under `"Import full grid"` section and click the corresponding
import button

### 3. Data export

In case you would like to share your grid with someone, navigate to `"Export full grid"` section and click `Export JSON`
button. The text box below will contain a JSON string of your grid to send over to your peers

### 4. Usage
The app will detect duplicate maps across your imported storage chest layouts.
Click on legend items to highlight duplicates in chests to simplify collection of them in game.

Once you're done with an item, click the "X"-mark next to it to remove it from table. In case you have removed something by mistake, group can be restored by clicking the "refresh"-style button next to the item (deleted items are near the end of the legend)

### 5. Reset and Clear

- **Reset table** button - allows you to restore table to last imported or exported state
- **Clear grid** button - allows you to wipe the data, emptying the dataset

### 6. TBD