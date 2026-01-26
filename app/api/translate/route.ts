import { NextResponse } from 'next/server';
// @ts-ignore
import { translate } from 'google-translate-api-x';

function toTitleCase(str: string) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export async function POST(request: Request) {
    try {
        const { text, target, source = 'ka', format } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const res = await translate(text, {
            to: target,
            from: source,
        }) as any;

        let translatedText = res.text;

        if (format === 'title') {
            translatedText = toTitleCase(translatedText);
        }

        return NextResponse.json({ text: translatedText });
    } catch (error: any) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Translation failed', details: error.message }, { status: 500 });
    }
}
