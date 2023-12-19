
// Input data --> ["Basic ID", "Display name"]
function formatColumnName(keys) {

    // map work similar for loop (กระทำกับข้อมูลในอาเรย์ทีละตัว)
    return keys.map((item) => {
        // Tranform Upper to Lower
        const itemlowerCase = item.toLocaleLowerCase();

        // Replace whitespace with underscore
        const withoutUnderscore = itemlowerCase.replace(/ /g, "_");

        // Remove ( ) \ when have in sentence
        const withoutParentheses = withoutUnderscore.replace(/\(|\)|\/|/g, "");
        return withoutParentheses;
    });

}


module.exports = { formatColumnName }