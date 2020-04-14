const NoteExample = (()=>{
    const example1 = {
        id:0,
        note_object:null,
        posted_user:0,
        posted_time:0,
        liked_number:2,
        reply_number:2,
        posted_tag:'test1,test2',
        posted_img:null,
        // ja
        ja_head:'これはテストです',
        ja_text:'こんにちはせかい',
        // en
        en_head:'This is test',
        en_text:'hello world!',
    }
    const example2 = {
        id:1,
        note_object:1,
        posted_user:0,
        posted_time:1,
        liked_number:2,
        reply_number:0,
        posted_tag:'test1',
        posted_img:null,
        // ja
        ja_head:'これはおまけです',
        ja_text:'さようならせかい',
        // en
        en_head:'This is bonus',
        en_text:'good-bye world!',
    }
    const example3 = {
        id:2,
        note_object:1,
        posted_user:1,
        posted_time:2,
        liked_number:10,
        reply_number:1,
        posted_tag:'',
        posted_img:null,
        // ja
        ja_head:'これはコメントです',
        ja_text:'このサービスはすごいです',
        // en
        en_head:'This is comment',
        en_text:'this service is amazing!',
    }
    return [example1, example2, example3]
})()

export default NoteExample;
