const saveFile = ({file, folder}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (file && folder)
        {
            const fileName = new Date().toISOString() + file.name
            file.mv(`media/${folder}/${fileName}`, err =>
            {
                if (err) reject(err)
                else resolve(`/media/${folder}/${fileName}`)
            })
        }
        else resolve(undefined)
    })
}

export default saveFile