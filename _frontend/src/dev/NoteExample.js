const NoteExample = (()=>{
    const example1 = {
        id:0, liked_number:2, reply_number:2,
        note_object:null, posted_user:1, posted_time:0,
        ja_text:'こんにちはせかい', en_text:'hello world!',
        reply:[{
            id:2, liked_number:2, reply_number:2,
            note_object:0, posted_user:1, posted_time:0,
            ja_text:'これはコメントです', en_text:'This is comment.',
        },]
    }
    const example2 = {
        id:1, liked_number:2, reply_number:0,
        note_object:1, posted_user:1, posted_time:1,
        ja_text:'さようならせかい', en_text:'good-bye world!',
    }
    const example3 = {
        id:2, liked_number:10, reply_number:1,
        note_object:1, posted_user:1, posted_time:2,
        ja_text:'このサービスはすごいです', en_text:'this service is amazing!',
    }
    return [example1, example2, example3]
})()

export default NoteExample;
