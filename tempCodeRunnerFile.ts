function canPlaceFlowers(flowerbed: number[], n: number): boolean {
    let plantable = 0

    for (let i = 0; i < flowerbed.length; i++) {
        const isEmpty = !!flowerbed[i] === false
        const noLeftNeighbor = !!flowerbed[i-1] === false
        const noRightNeighbor = !!flowerbed[i+1] === false

        if (isEmpty && noLeftNeighbor && noRightNeighbor) {
            flowerbed[i] = 1
            plantable++
        }
    }

    return plantable >= n
}

function canPlaceFlowers2(flowerbed: number[], n: number): boolean {
    let plantable = 0

    for (let i = 0; i < flowerbed.length; i++) {
        const isEmpty = !!flowerbed[i] === false
        const noLeftNeighbor = !!flowerbed[i-1] === false
        const noRightNeighbor = !!flowerbed[i+1] === false

        if (isEmpty && noLeftNeighbor && noRightNeighbor) {
            flowerbed[i] = 1
            plantable++
            // skip next since it now has neighbor
            i++
        } else if (!isEmpty) {
            // skip the next one also
            i++
        }
    }

    return plantable >= n
}

const test = [
    {
        flowerbed: [0, 1, 0, 0],
        n: 1
    },
    {
        flowerbed: [1, 0, 0, 0, 1], 
        n: 1
    },
    {
        flowerbed: [1, 0, 0, 1, 0], 
        n: 1
    },
    {
        flowerbed: [1, 0, 0, 0, 1], 
        n: 2
    },
    {
        flowerbed: [1,0,0,0,0,1],
        n: 2
    }, 
    {
        flowerbed: [0,0,1,0,1],
        n: 1
    }
]

test.forEach(test => console.log(canPlaceFlowers2(test.flowerbed, test.n)))

