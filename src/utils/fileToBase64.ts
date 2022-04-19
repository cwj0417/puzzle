export default (file: File, cb: any) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
        const img = new Image()
        img.onload = () => {
            const puzzle = document.createElement('canvas')
            puzzle.width = img.width
            puzzle.height = img.height
            const puzzleCtx = puzzle.getContext('2d')
            puzzleCtx!.drawImage(img, 0, 0)
            cb(puzzle.toDataURL('image/png'), img.height / img.width)
        }
        img.src = e.target.result
    }

    reader.readAsDataURL(file)

}