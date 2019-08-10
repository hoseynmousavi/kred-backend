import JDate from 'jalali-date'

const datePickerRouter = (app) =>
{
    app.route('/DatePicker')
        .get((req, res) =>
        {
            const date = new JDate().format('YYYY/MM/DD')
            const year = date.split('/')[0]
            const month = date.split('/')[1]
            const day = date.split('/')[2]
            res.send([date, year, month, day])
        })
}

export default datePickerRouter
