import mongoose from "mongoose"
import lessonModel from "../models/lessonModel"
import blockModel from "../models/blockModel"

const lesson = mongoose.model("lesson", lessonModel)
const block = mongoose.model("block", blockModel)

const getLessons = (req, res) =>
{
    lesson.find(null, "title svg", null, (err, lessons) =>
    {
        if (err) res.status(400).send(err)
        else res.send(lessons)
    })
}

const addLesson = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.is_deleted
        delete req.body.created_date

        const svg = req.files ? req.files.svg : null
        const title = req.body.title

        if (svg && title)
        {
            const svgName = new Date().toISOString() + svg.name
            svg.mv(`media/svgs/${svgName}`, (err) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    const newLesson = new lesson({title, svg: `/media/svgs/${svgName}`})
                    newLesson.save((err, createdLesson) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(createdLesson)
                    })
                }
            })
        }
        else res.status(400).send({message: "send svg && title!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getBlocks = (req, res) =>
{
    block.find(null, "title svg", null, (err, blocks) =>
    {
        if (err) res.status(400).send(err)
        else res.send(blocks)
    })
}

const addBlock = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.is_deleted
        delete req.body.created_date

        const svg = req.files ? req.files.svg : null
        const title = req.body.title

        if (svg && title)
        {
            const svgName = new Date().toISOString() + svg.name
            svg.mv(`media/svgs/${svgName}`, (err) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    const newBlock = new block({title, svg: `/media/svgs/${svgName}`})
                    newBlock.save((err, createdBlock) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(createdBlock)
                    })
                }
            })
        }
        else res.status(400).send({message: "send svg && title!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const classController = {
    getLessons,
    addLesson,
    getBlocks,
    addBlock,
}

export default classController