export default function replaceEmoticons(text) {
    const folder = 'src/emotes/';
    const emoticons = {
        '>(' : folder + 'angry.png',
        ':D' : folder + 'big_grin.png',
        ':z' : folder + 'bored.png',
        'o_O': folder + 'confused.png',
        ':B)': folder + 'cool.png',
        '<3' : folder + 'heart.png',
        'R)' : folder + 'pirate.png',
        ':(' : folder + 'sad.png',
        ':)' : folder + 'smile.png',
        ':P' : folder + 'sticking_tongue_out.png',
        ':o' : folder + 'surprised.png',
        ':\\': folder + 'undecided.png',
        ';p' : folder + 'wink.png',
        ';)' : folder + 'winking.png'
    }, url = "http://localhost:8080/";

    return text.replace(/[:;>R(Ppzo\\B)D]+/g, function (match) {
        return typeof emoticons[match] != 'undefined' ? '<img src="'+url+emoticons[match]+'"/>' : match;
    });
}