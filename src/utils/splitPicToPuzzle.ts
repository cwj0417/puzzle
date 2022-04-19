export default (file: File, x: number, y: number, cb: any) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
        const img = new Image()
        img.onload = () => {
            const puzzles = []
            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    const puzzle = document.createElement('canvas')
                    puzzle.width = img.width / x
                    puzzle.height = img.height / y
                    const puzzleCtx = puzzle.getContext('2d')
                    puzzleCtx!.drawImage(img, j * puzzle.width, i * puzzle.height, puzzle.width, puzzle.height, 0, 0, puzzle.width, puzzle.height)
                    puzzles.push(puzzle.toDataURL('image/png'))
                }
            }
            cb(puzzles)
        }
        img.src = e.target.result
    }
    reader.readAsDataURL(file)
}