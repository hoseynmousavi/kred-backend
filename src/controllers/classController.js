import mongoose from "mongoose"
import lessonModel from "../models/lessonModel"
import blockModel from "../models/blockModel"
import lessonCategoryModel from "../models/lessonCategoryModel"
import blockCategoryModel from "../models/blockCategoryModel"
import educationResourceModel from "../models/educationResourceModel"
import educationCommentModel from "../models/educationCommentModel"
import educationLikeModel from "../models/educationLikeModel"
import educationCommentLikeModel from "../models/educationCommentLikeModel"
import userController from "./userController"
import notificationController from "./notificationController"
import data from "../data"
import educationSaveModel from "../models/educationSaveModel"
import videoPackController from "./videoPackController"

const lesson = mongoose.model("lesson", lessonModel)
const lessonCategory = mongoose.model("lessonCategory", lessonCategoryModel)
const block = mongoose.model("block", blockModel)
const blockCategory = mongoose.model("blockCategory", blockCategoryModel)
const educationResource = mongoose.model("educationResource", educationResourceModel)
const comment = mongoose.model("educationComment", educationCommentModel)
const like = mongoose.model("educationLike", educationLikeModel)
const save = mongoose.model("educationSave", educationSaveModel)
const commentLike = mongoose.model("educationCommentLike", educationCommentLikeModel)

const getLessonSiteMap = () =>
{
    return new Promise((resolve, reject) =>
    {
        let urls = ""
        lesson.find({is_deleted: false}, (err, lessons) =>
        {
            if (err) reject({status: 500, err})
            else
            {
                lessonCategory.find({is_deleted: false}, (err, lessonCategories) =>
                {
                    if (err) reject({status: 500, err})
                    else
                    {
                        educationResource.find({is_deleted: false}, (err, lessonCategoryEducations) =>
                        {
                            if (err) reject({status: 500, err})
                            else
                            {
                                lessons.forEach((lessonItem) =>
                                {
                                    if (lessonCategories.filter(cat => cat.lesson_id && cat.lesson_id.toString() === lessonItem._id.toString()).length > 0)
                                    {
                                        lessonCategories.filter(cat => cat.lesson_id && cat.lesson_id.toString() === lessonItem._id.toString()).forEach((categoryItem) =>
                                        {
                                            lessonCategoryEducations.filter(edu => edu.lesson_category_id && edu.lesson_category_id.toString() === categoryItem._id.toString()).forEach(item =>
                                                urls = urls + `https://www.kred.ir/class/lesson/${lessonItem._id}/${categoryItem._id}/resources/${item._id}\n`,
                                            )
                                        })
                                    }
                                    else
                                    {
                                        lessonCategoryEducations.filter(edu => edu.lesson_id && edu.lesson_id.toString() === lessonItem._id.toString()).forEach(item =>
                                            urls = urls + `https://www.kred.ir/class/lesson/${lessonItem._id}/resources/${item._id}\n`,
                                        )
                                    }
                                })
                                resolve(urls)
                            }
                        })
                    }
                })
            }
        })
    })
}

const getBlockSiteMap = () =>
{
    return new Promise((resolve, reject) =>
    {
        let urls = ""
        block.find({is_deleted: false}, (err, blocks) =>
        {
            if (err) reject({status: 500, err})
            else
            {
                blockCategory.find({is_deleted: false}, (err, blockCategories) =>
                {
                    if (err) reject({status: 500, err})
                    else
                    {
                        educationResource.find({is_deleted: false}, (err, blockCategoryEducations) =>
                        {
                            if (err) reject({status: 500, err})
                            else
                            {
                                blocks.forEach((blockItem) =>
                                {
                                    if (blockCategories.filter(cat => cat.block_id && cat.block_id.toString() === blockItem._id.toString()).length > 0)
                                    {
                                        blockCategories.filter(cat => cat.block_id && cat.block_id.toString() === blockItem._id.toString()).forEach((categoryItem) =>
                                        {
                                            blockCategoryEducations.filter(edu => edu.block_category_id && edu.block_category_id.toString() === categoryItem._id.toString()).forEach(item =>
                                                urls = urls + `https://www.kred.ir/class/block/${blockItem._id}/${categoryItem._id}/resources/${item._id}\n`,
                                            )
                                        })
                                    }
                                    else
                                    {
                                        blockCategoryEducations.filter(edu => edu.block_id && edu.block_id.toString() === blockItem._id.toString()).forEach(item =>
                                            urls = urls + `https://www.kred.ir/class/block/${blockItem._id}/resources/${item._id}\n`,
                                        )
                                    }
                                })
                                resolve(urls)
                            }
                        })
                    }
                })
            }
        })
    })
}

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
        let query = {is_deleted: false, lesson_id: req.query.lesson_id}
        if (req.query.title) query.title = new RegExp(req.query.title)
        lessonCategory.find(query, "title svg video_pack_id", null, (err, categories) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                let categoriesObject = categories.reduce((sum, category) => ({...sum, [category._id]: category.toJSON()}), {})
                videoPackController.getVideoPacksFunc({condition: {_id: {$in: Object.values(categoriesObject).reduce((sum, cat) => [...sum, ...cat.video_pack_id], [])}}})
                    .then(result =>
                    {
                        const packs = result.takenVideoPacks.reduce((sum, pack) => ({...sum, [pack._id]: pack.toJSON()}), {})
                        Object.values(categoriesObject).forEach(cat =>
                        {
                            if (cat.video_pack_id && cat.video_pack_id.length > 0)
                            {
                                categoriesObject[cat._id].videos = []
                                cat.video_pack_id.forEach(item =>
                                {
                                    categoriesObject[cat._id].videos = [...categoriesObject[cat._id].videos, packs[item._id]]
                                })
                                delete categoriesObject[cat._id].video_pack_id
                            }
                            else delete categoriesObject[cat._id].video_pack_id
                        })
                        res.send(Object.values(categoriesObject))
                    })
                    .catch(err => res.status(err.status || 500).send(err.err))
            }
        })
    }
    else if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        lessonCategory.find({is_deleted: false}, (err, categories) =>
        {
            if (err) res.status(500).send(err)
            else res.send(categories)
        })
    }
    else res.status(400).send({message: "send lesson_id as query param"})
}

const getLessonCategoryById = (req, res) =>
{
    lessonCategory.findOne({is_deleted: false, _id: req.params.category_id}, "title svg", null, (err, takenCategory) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenCategory) res.status(404).send({message: "not found!"})
        else res.send(takenCategory)
    })
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
    block.find({is_deleted: false}, "title svg video_pack_id", null, (err, blocks) =>
    {
        if (err) res.status(500).send(err)
        else
        {
            let blocksObject = blocks.reduce((sum, block) => ({...sum, [block._id]: block.toJSON()}), {})
            videoPackController.getVideoPacksFunc({condition: {_id: {$in: Object.values(blocksObject).reduce((sum, cat) => [...sum, ...cat.video_pack_id], [])}}})
                .then(result =>
                {
                    const packs = result.takenVideoPacks.reduce((sum, pack) => ({...sum, [pack._id]: pack.toJSON()}), {})
                    Object.values(blocksObject).forEach(cat =>
                    {
                        if (cat.video_pack_id && cat.video_pack_id.length > 0)
                        {
                            blocksObject[cat._id].videos = []
                            cat.video_pack_id.forEach(item =>
                                blocksObject[cat._id].videos = [...blocksObject[cat._id].videos, packs[item._id]],
                            )
                            delete blocksObject[cat._id].video_pack_id
                        }
                        else delete blocksObject[cat._id].video_pack_id
                    })
                    res.send(Object.values(blocksObject))
                })
                .catch(err => res.status(err.status || 500).send(err.err))
        }
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
        let query = {is_deleted: false, block_id: req.query.block_id}
        if (req.query.title) query.title = new RegExp(req.query.title)
        blockCategory.find(query, "title svg video_pack_id", (err, categories) =>
        {
            let categoriesObject = categories.reduce((sum, category) => ({...sum, [category._id]: category.toJSON()}), {})
            if (err) res.status(500).send(err)
            else
            {
                videoPackController.getVideoPacksFunc({condition: {_id: {$in: Object.values(categoriesObject).reduce((sum, cat) => [...sum, ...cat.video_pack_id], [])}}})
                    .then(result =>
                    {
                        const packs = result.takenVideoPacks.reduce((sum, pack) => ({...sum, [pack._id]: pack.toJSON()}), {})
                        Object.values(categoriesObject).forEach(cat =>
                        {
                            if (cat.video_pack_id && cat.video_pack_id.length > 0)
                            {
                                categoriesObject[cat._id].videos = []
                                cat.video_pack_id.forEach(item =>
                                {
                                    categoriesObject[cat._id].videos = [...categoriesObject[cat._id].videos, packs[item._id]]
                                })
                                delete categoriesObject[cat._id].video_pack_id
                            }
                            else delete categoriesObject[cat._id].video_pack_id
                        })
                        res.send(Object.values(categoriesObject))
                    })
                    .catch(err => res.status(err.status || 500).send(err.err))
            }
        })
    }
    else if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        blockCategory.find({is_deleted: false}, (err, categories) =>
        {
            if (err) res.status(500).send(err)
            else res.send(categories)
        })
    }
    else res.status(400).send({message: "send block_id as query param"})
}

const getBlockCategoryById = (req, res) =>
{
    blockCategory.findOne({is_deleted: false, _id: req.params.category_id}, "title svg", null, (err, takenCategory) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenCategory) res.status(404).send({message: "not found!"})
        else res.send(takenCategory)
    })
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

const addEducationResource = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {lesson_category_id, block_category_id, lesson_id, block_id} = req.body
        if (lesson_category_id || block_category_id || lesson_id || block_id)
        {
            const file = req.files ? req.files.file : null
            const picture = req.files ? req.files.picture : null
            if (file)
            {
                const fileName = new Date().toISOString() + file.name
                file.mv(`media/files/${fileName}`, (err) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        if (picture)
                        {
                            const pictureName = new Date().toISOString() + picture.name
                            picture.mv(`media/pictures/${pictureName}`, (err) =>
                            {
                                if (err) console.log(err)
                                const newEducation = new educationResource({...req.body, file: `/media/files/${fileName}`, picture: `/media/pictures/${pictureName}`})
                                newEducation.save((err, createdEducation) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else res.send(createdEducation)
                                })
                            })
                        }
                        else
                        {
                            const newEducation = new educationResource({...req.body, file: `/media/files/${fileName}`})
                            newEducation.save((err, createdEducation) =>
                            {
                                if (err) res.status(400).send(err)
                                else res.send(createdEducation)
                            })
                        }
                    }
                })
            }
            else res.status(400).send({message: "send file!"})
        }
        else res.status(400).send({message: "please send lesson_category_id || block_category_id || lesson_id || block_id"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const updateEducationResource = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.type

        const file = req.files ? req.files.file : null
        const picture = req.files ? req.files.picture : null
        if (file)
        {
            const fileName = new Date().toISOString() + file.name
            file.mv(`media/files/${fileName}`, (err) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    if (picture)
                    {
                        const pictureName = new Date().toISOString() + picture.name
                        picture.mv(`media/pictures/${pictureName}`, (err) =>
                        {
                            if (err) console.log(err)
                            educationResource.findOneAndUpdate(
                                {_id: req.body.education_id},
                                {...req.body, file: `/media/files/${fileName}`, picture: `/media/pictures/${pictureName}`},
                                {new: true, useFindAndModify: false, runValidators: true}, (err, updated) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else res.send(updated)
                                },
                            )
                        })
                    }
                    else
                    {
                        educationResource.findOneAndUpdate(
                            {_id: req.body.education_id},
                            {...req.body, file: `/media/files/${fileName}`},
                            {new: true, useFindAndModify: false, runValidators: true}, (err, updated) =>
                            {
                                if (err) res.status(400).send(err)
                                else res.send(updated)
                            },
                        )
                    }
                }
            })
        }
        else
        {
            if (picture)
            {
                const pictureName = new Date().toISOString() + picture.name
                picture.mv(`media/pictures/${pictureName}`, (err) =>
                {
                    if (err) console.log(err)
                    educationResource.findOneAndUpdate(
                        {_id: req.body.education_id},
                        {...req.body, picture: `/media/pictures/${pictureName}`},
                        {new: true, useFindAndModify: false, runValidators: true}, (err, updated) =>
                        {
                            if (err) res.status(400).send(err)
                            else res.send(updated)
                        },
                    )
                })
            }
            else
            {
                educationResource.findOneAndUpdate(
                    {_id: req.body.education_id},
                    {...req.body},
                    {new: true, useFindAndModify: false, runValidators: true}, (err, updated) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(updated)
                    },
                )
            }
        }
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getEducationResource = (req, res) =>
{
    const {lesson_category_id, block_category_id, lesson_id, block_id, type} = req.query
    if (lesson_category_id || block_category_id || lesson_id || block_id)
    {
        let query = {is_deleted: false}
        const fields = "title likes_count comments_count is_many university pages_count teacher subject type file"
        if (type) query.type = type
        if (lesson_category_id) query.lesson_category_id = lesson_category_id
        if (block_category_id) query.block_category_id = block_category_id
        if (lesson_id) query.lesson_id = lesson_id
        if (block_id) query.block_id = block_id
        educationResource.find(query, fields, null, (err, takenEducations) =>
        {
            if (err) res.status(400).send(err)
            else res.send(takenEducations)
        })
    }
    else if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 50
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        educationResource.find({is_deleted: false}, null, {sort: "-created_date", skip, limit}, (err, takenEducations) =>
        {
            if (err) res.status(400).send(err)
            else res.send(takenEducations)
        })
    }
    else res.status(400).send({message: "please send lesson_category_id || block_category_id || lesson_id || block_id as query param"})
}

const getEducationResourceCount = (req, res) =>
{
    educationResource.countDocuments(null, (err, count) =>
    {
        if (err) res.status(500).send(err)
        else res.send({count})
    })
}

const getEducationResourceById = (req, res) =>
{
    educationResource.findOne({is_deleted: false, _id: req.params.education_id}, "title likes_count comments_count is_many university pages_count teacher subject writer type picture file created_date", null, (err, takenEducation) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenEducation) res.status(404).send({message: "not found!"})
        else
        {
            if (req.headers.authorization)
            {
                const user_id = req.headers.authorization._id
                like.findOne({user_id, education_id: req.params.education_id}, (err, takenLike) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        const is_liked = takenLike !== null
                        save.findOne({user_id, education_id: req.params.education_id}, (err, takenSave) =>
                        {
                            if (err) res.status(500).send(err)
                            else
                            {
                                const is_saved = takenSave !== null
                                res.send({...takenEducation.toJSON(), is_saved, is_liked})
                            }
                        })
                    }
                })
            }
            else res.send(takenEducation)
        }
    })
}

const addNewLike = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newLike = new like(req.body)
    newLike.save((err, createdLike) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            educationResource.findOneAndUpdate(
                {_id: req.body.education_id},
                {$inc: {likes_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send(createdLike)
                },
            )
        }
    })
}

const deleteLike = (req, res) =>
{
    like.deleteOne({education_id: req.params.education_id, user_id: req.headers.authorization._id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            educationResource.findOneAndUpdate(
                {_id: req.params.education_id},
                {$inc: {likes_count: -1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send({message: "like deleted successfully"})
                },
            )
        }
        else res.status(404).send({message: "like not found!"})
    })
}

const addNewCommentLike = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newLike = new commentLike(req.body)
    newLike.save((err, createdLike) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            comment.findOneAndUpdate(
                {_id: req.body.comment_id},
                {$inc: {likes_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send(createdLike)
                },
            )
        }
    })
}

const deleteCommentLike = (req, res) =>
{
    commentLike.deleteOne({comment_id: req.params.comment_id, user_id: req.headers.authorization._id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            comment.findOneAndUpdate(
                {_id: req.params.comment_id},
                {$inc: {likes_count: -1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send({message: "like deleted successfully"})
                },
            )
        }
        else res.status(404).send({message: "like not found!"})
    })
}

const addNewComment = (req, res) =>
{
    delete req.body.created_date
    delete req.body.is_deleted
    delete req.body.likes_count
    delete req.body.children_count
    req.body.user_id = req.headers.authorization._id
    const newComment = new comment(req.body)
    newComment.save((err, createdComment) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            educationResource.findOneAndUpdate(
                {_id: req.body.education_id},
                {$inc: {comments_count: 1}},
                {useFindAndModify: false},
                (err, updatedEducation) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        res.send(createdComment)

                        if (createdComment.reply_comment_id)
                        {
                            comment.findById(createdComment.reply_comment_id, (err, takenComment) =>
                            {
                                if (err) console.log(err)
                                else
                                {
                                    userController.getUsers({condition: {_id: takenComment.user_id}})
                                        .then(result =>
                                        {
                                            if (result.users && result.users.length === 1)
                                            {
                                                const user = result.users[0]
                                                if (user._id.toString() !== createdComment.user_id.toString())
                                                {
                                                    notificationController.sendNotification({
                                                        user_id: user._id,
                                                        title: `${req.headers.authorization.name} پاسخ کامنت شما را داده است!`,
                                                        image: data.restful_url + req.headers.authorization.avatar,
                                                        icon: data.domain_url + "/logo192.png",
                                                        url: data.domain_url +
                                                            `/class/lesson/${updatedEducation.lesson_category_id || updatedEducation.block_category_id || updatedEducation.lesson_id || updatedEducation.block_id}/resources/` +
                                                            updatedEducation._id,
                                                        body: createdComment.description,
                                                        tag: createdComment._id.toString() + "reply",
                                                        requireInteraction: true,
                                                        renotify: true,
                                                    })
                                                }
                                            }
                                        })
                                }
                            })
                        }


                        for (let i = 0; i < data.adminIds.length; i++)
                        {
                            setTimeout(() =>
                                {
                                    notificationController.sendNotification({
                                        user_id: data.adminIds[i],
                                        title: `ادمین! ${req.headers.authorization.name || req.headers.authorization.phone} برامون کامنت گذاشته!`,
                                        icon: data.domain_url + "/logo192.png",
                                        url: data.domain_url +
                                            `/class/lesson/${updatedEducation.lesson_category_id || updatedEducation.block_category_id || updatedEducation.lesson_id || updatedEducation.block_id}/resources/` +
                                            updatedEducation._id,
                                        body: createdComment.description,
                                        tag: createdComment._id.toString() + "admin",
                                        requireInteraction: true,
                                        renotify: true,
                                    })
                                }
                                , i * 1000)
                        }
                    }
                },
            )
        }
    })
}

const getEducationComments = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 50
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    comment.find({is_deleted: false, education_id: req.params.education_id, parent_comment_id: {$exists: false}}, "description reply_comment_id parent_comment_id created_date likes_count user_id", {sort: "-created_date", skip, limit}, (err, comments) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            let commentsObj = comments.reduce((sum, comment) => ({...sum, [comment.id]: {...comment.toJSON()}}), {})

            comment.find(
                {is_deleted: false, parent_comment_id: [...new Set(comments.reduce((sum, comment) => [...sum, comment._id], []))]},
                "description reply_comment_id parent_comment_id created_date likes_count user_id",
                (err, childs) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        commentsObj = {...commentsObj, ...childs.reduce((sum, comment) => ({...sum, [comment.id]: {...comment.toJSON()}}), {})}
                        userController.getUsers({projection: "avatar name university", condition: {_id: {$in: [...new Set(Object.values(commentsObj).reduce((sum, comment) => [...sum, comment.user_id], []))]}}})
                            .then(result =>
                            {
                                const usersObj = result.users.reduce((sum, user) => ({...sum, [user.id]: {...user.toJSON()}}), {})
                                Object.values(commentsObj).forEach(item =>
                                {
                                    item.user = usersObj[item.user_id]
                                    delete item.user_id
                                })

                                if (req.headers.authorization)
                                {
                                    const user_id = req.headers.authorization._id
                                    commentLike.find({user_id, comment_id: {$in: Object.values(commentsObj).reduce((sum, comment) => [...sum, comment._id], [])}}, (err, likes) =>
                                    {
                                        if (err) res.status(500).send(err)
                                        else
                                        {
                                            likes.forEach(like => commentsObj[like.comment_id].is_liked = true)
                                            res.send(Object.values(commentsObj))
                                        }
                                    })
                                }
                                else res.send(Object.values(commentsObj))
                            })
                            .catch(result => res.status(result.status || 500).send(result.err))
                    }
                },
            )
        }
    })
}

const deleteComment = (req, res) =>
{
    comment.findOne({_id: req.params.comment_id, user_id: req.headers.authorization._id, is_deleted: false}, (err, takenComment) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenComment) res.status(404).send({message: "comment not found!"})
        else
        {
            comment.findOneAndUpdate(
                {_id: req.params.comment_id, user_id: req.headers.authorization._id},
                {is_deleted: true},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else
                    {
                        educationResource.findOneAndUpdate(
                            {_id: takenComment.education_id},
                            {$inc: {comments_count: -1}},
                            {useFindAndModify: false},
                            (err) =>
                            {
                                if (err) res.status(400).send(err)
                                else res.send({message: "comment deleted successfully"})
                            },
                        )
                    }
                },
            )
        }
    })
}

const addNewSave = (req, res) =>
{
    delete req.body.created_date
    const user_id = req.headers.authorization._id
    const {education_id} = req.body
    if (education_id && user_id)
    {
        educationResource.findOne({is_deleted: false, _id: education_id}, (err, takenEducation) =>
        {
            if (err) res.status(400).send(err)
            else if (!takenEducation) res.status(404).send({message: "education not found!"})
            else
            {
                const newSave = new save({user_id, education_id, education_type: takenEducation.toJSON().type})
                newSave.save((err, createdSave) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(createdSave)
                })
            }
        })
    }
    else res.status(400).send({message: "send education_id!"})
}

const deleteSave = (req, res) =>
{
    save.deleteOne({education_id: req.params.education_id, user_id: req.headers.authorization._id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            if (err) res.status(500).send(err)
            else res.send({message: "save deleted successfully"})
        }
        else res.status(404).send({message: "save not found!"})
    })
}

const classController = {
    getLessonSiteMap,
    getBlockSiteMap,
    getLessons,
    addLesson,
    getLessonById,
    getLessonCategories,
    getLessonCategoryById,
    addLessonCategory,
    getBlocks,
    getBlockById,
    addBlock,
    getBlockCategories,
    getBlockCategoryById,
    addBlockCategory,
    addEducationResource,
    updateEducationResource,
    getEducationResource,
    getEducationResourceCount,
    getEducationResourceById,
    addNewLike,
    deleteLike,
    addNewCommentLike,
    deleteCommentLike,
    addNewComment,
    getEducationComments,
    deleteComment,
    addNewSave,
    deleteSave,
}

export default classController