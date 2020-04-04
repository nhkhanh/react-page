import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import HtmlToSlate from '../HtmlToSlate';
import { SlatePlugin } from '../types/SlatePlugin';

const withPaste = (plugins: SlatePlugin[], defaultPluginType: string) => (
  editor: ReactEditor
) => {
  const { insertData } = editor;
  const htmlToSlate = HtmlToSlate({ plugins });
  editor.insertData = data => {
    const html = data.getData('text/html');
    if (html) {
      const { slate } = htmlToSlate(html);

      Transforms.insertFragment(editor, slate);
      return;
    }

    const text = data.getData('text/plain');
    if (text) {
      const lines = text.split('\n');
      Transforms.insertText(editor, lines[0]);
      for (let i = 1; i < lines.length; i++) {
          Transforms.insertNodes(editor, {
            type: defaultPluginType,
            children: [{ text: lines[i] }],
          });
      }
      return;
    }

    insertData(data);
  };
  return editor;
};

export default withPaste;
