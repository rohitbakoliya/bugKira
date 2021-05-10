import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ErrorMessage } from '@hookform/error-message';
import { useSelector } from 'react-redux';
import { MentionsInput, Mention } from 'react-mentions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Avatar, Flex } from '@bug-ui';
import { InputWrapper } from '@bug-ui/Form';

import { StyledMentionList } from './Editor.style';
import { StoreState } from 'store';
import { renderMarkdown, htmlDecode } from 'utils';
import useSuggestion from './useSuggestion';
import components from './CodeBlock';

interface EditorProps {
  markdown: string;
  inputRef?: any;
  errors?: any;
  handleMarkdown?: (e: any) => void;
}

const Editor: React.FC<EditorProps> = ({ markdown, inputRef, errors, handleMarkdown }) => {
  const user = useSelector((state: StoreState) => state.auth.user);

  // fetch mention suggestions
  const allUsers = useSuggestion('/api/user', ['username', 'username']);
  const allBugs = useSuggestion('/api/bugs/suggestions', ['title', 'bugId']);

  return (
    <>
      <Tabs forceRenderTabPanel={true}>
        <Flex className="editor__header" align="center">
          <Avatar width="45px" height="45px" size={45} username={user?.username} />
          <TabList>
            <Tab>Write</Tab>
            <Tab>Preview</Tab>
          </TabList>
        </Flex>
        <TabPanel>
          <InputWrapper>
            <StyledMentionList>
              <MentionsInput
                name="body"
                placeholder="Write Markdown"
                className="editor__tabpanel"
                inputRef={inputRef({ required: 'Body is required' })}
                value={htmlDecode(markdown)}
                onChange={handleMarkdown}
              >
                <Mention
                  className="mentions__item"
                  trigger="@"
                  displayTransform={(id: any) => `@${id} `}
                  data={allUsers}
                />
                <Mention
                  markup="{{__id__}} Yeah"
                  className="mentions__item"
                  trigger="#"
                  displayTransform={(id: any) => `#${id} `}
                  data={allBugs}
                />
              </MentionsInput>
            </StyledMentionList>
          </InputWrapper>
        </TabPanel>
        <TabPanel>
          <ReactMarkdown
            skipHtml={true}
            className="editor__tabpanel markdown-preview"
            children={renderMarkdown(markdown)}
            components={components as any}
          />
        </TabPanel>
      </Tabs>
      {/* textarea error */}
      {errors && (
        <div className={`text--error ${errors['body'] && 'show-error'}`} style={{ marginLeft: 0 }}>
          <ErrorMessage errors={errors} name={'body'} />
        </div>
      )}
    </>
  );
};

export default React.memo(Editor);
