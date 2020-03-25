import mongoose from "mongoose"
import lessonModel from "../models/lessonModel"
import blockModel from "../models/blockModel"
import lessonCategoryModel from "../models/lessonCategoryModel"
import blockCategoryModel from "../models/blockCategoryModel"

const lesson = mongoose.model("lesson", lessonModel)
const lessonCategory = mongoose.model("lessonCategory", lessonCategoryModel)
const block = mongoose.model("block", blockModel)
const blockCategory = mongoose.model("blockCategory", blockCategoryModel)

const getLessons = (req, res) =>
{
    lesson.find({is_deleted: false}, "title svg", null, (err, lessons) =>
    {
        if (err) res.status(500).send(err)
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

const getLessonById = (req, res) =>
{
    lesson.findOne({is_deleted: false, _id: req.params.lesson_id}, "title svg", null, (err, takenLesson) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenLesson) res.status(404).send({message: "not found!"})
        else res.send(takenLesson)
    })
}

const getLessonCategories = (req, res) =>
{
    if (req.query.lesson_id)
    {
        lessonCategory.find({is_deleted: false, lesson_id: req.query.lesson_id}, "title svg", null, (err, lessons) =>
        {
            if (err) res.status(500).send(err)
            else res.send(lessons)
        })
    }
    else res.status(400).send({message: "send lesson_id as query param"})
}

const addLessonCategory = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.is_deleted
        delete req.body.created_date

        const svg = req.files ? req.files.svg : null
        const title = req.body.title
        const lesson_id = req.body.lesson_id

        if (svg && title && lesson_id)
        {
            const svgName = new Date().toISOString() + svg.name
            svg.mv(`media/svgs/${svgName}`, (err) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    const newLessonCategory = new lessonCategory({title, lesson_id, svg: `/media/svgs/${svgName}`})
                    newLessonCategory.save((err, createdLessonCategory) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(createdLessonCategory)
                    })
                }
            })
        }
        else res.status(400).send({message: "send svg && title && lesson_id!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getBlocks = (req, res) =>
{
    block.find({is_deleted: false}, "title svg", null, (err, blocks) =>
    {
        if (err) res.status(500).send(err)
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

const getBlockById = (req, res) =>
{
    block.findOne({is_deleted: false, _id: req.params.block_id}, "title svg", null, (err, takenBlock) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenBlock) res.status(404).send({message: "not found!"})
        else res.send(takenBlock)
    })
}

const getBlockCategories = (req, res) =>
{
    if (req.query.block_id)
    {
        blockCategory.find({is_deleted: false, block_id: req.query.block_id}, "title svg", null, (err, lessons) =>
        {
            if (err) res.status(500).send(err)
            else res.send(lessons)
        })
    }
    else res.status(400).send({message: "send block_id as query param"})
}

const addBlockCategory = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.is_deleted
        delete req.body.created_date

        const svg = req.files ? req.files.svg : null
        const title = req.body.title
        const block_id = req.body.block_id

        if (svg && title && block_id)
        {
            const svgName = new Date().toISOString() + svg.name
            svg.mv(`media/svgs/${svgName}`, (err) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    const newBlockCategory = new blockCategory({title, block_id, svg: `/media/svgs/${svgName}`})
                    newBlockCategory.save((err, createdBlockCategory) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(createdBlockCategory)
                    })
                }
            })
        }
        else res.status(400).send({message: "send svg && title && block_id!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const classController = {
    getLessons,
    addLesson,
    getLessonById,
    getLessonCategories,
    addLessonCategory,
    getBlocks,
    getBlockById,
    addBlock,
    getBlockCategories,
    addBlockCategory,
}

export default classController