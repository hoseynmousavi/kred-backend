# kred-backend
this is a really interesting repository for kred.ir backend 

kred-backend end-points routes:

    دسته بندی
    /category
        get => (limit = 9 , page = 1)

    /category/:categoryId
        get


    شهر
    /city
        get => (limit = 9 , page = 1)


    گپ و گفت
    /conversation
        get => (limit = 9 , page = 1)
        post => (title*, description*, picture*, bold_description) sender "should" be admin

    /conversation/:conversationId
        get

    /conversation/like
        post => (conversation_id*)

    /conversation/like/:conversationId
        delete

    /conversation/comment
        post => (conversation_id*, description* : min-length is 1)
        patch => (comment_id, description)

    /conversation/comments/:conversationId (getting a conversation comments)
        get

    /conversation/comment/:commentId
        delete


    تبادل کتاب
    /exchange
        get => (limit = 9 , page = 1)
        post => (title* : min-length is 1, price*, telegram || whatsapp || phone, description*, picture*, city_id*, categories* : stringify-array)
        patch => (title, price, telegram, whatsapp, phone, description, picture, city_id, categories : stringify-array)

    /exchange/:exchangeId
        get
        delete


    کاربر
    /user
        post => (phone*, password*, email, name, major, birth_date, university, avatar)
        patch => (phone, password, email, name, major, birth_date, university, avatar)



as everyone expect, this list will be updated due back updates.