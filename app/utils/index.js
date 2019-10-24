module.exports = {
    escapeChars(str) {
        return str
                .split(/([&<>"'])/)
                .map(elem => {
                    switch(elem){
                        case '&':
                            return '&amp;';
                        case '<':
                            return '&lt;';
                        case '>':
                            return '&gt;';
                        case '"':
                            return '&quot;';
                        case "'":
                            return '&apos;';
                        case "/":
                            return '&#47;';
                        case "-":
                            return '&#45;';
                        case "#":
                            return '&#35;';
                        default:
                            return elem;
                    }
                })
                .join('');
    }
}