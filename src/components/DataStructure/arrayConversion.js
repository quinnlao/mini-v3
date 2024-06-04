const isInline = (item) => {
    if (item.inline) return true;

    return false;
}

const conversionTo2DArray = (items, num) => {
    const result = [];
    let i = 0;
    while (items.length > 0) {
        if (isInline(items[i])) {
            result.push(items.splice(0, i));
        }
        else {
            result.push(items.splice(0, num));
        }
        i++
    }
    return result;
}
const object= [
    {
        order: '0',
    },
    {
        order: '1',
        inline: true,
    },
    {
        order: '2',
        inline: true,
    },
    {
        order: '3',
    },
    {
        order: '4',
    },
    {
        order: '5',
        inline: true,
    },
]
console.log(conversionTo2DArray(object, 2));
