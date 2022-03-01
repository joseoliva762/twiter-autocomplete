import { useRef, useState } from "react";
import { getActiveToken } from './utils/getActiveToken';
import { useSearchBox } from 'react-instantsearch-hooks';
import AutoComplete from "./components/AutoComplete";
import getCaretCoordinates from "textarea-caret";

function App () {
  const inputRef = useRef();
  const { top, height } = inputRef.current
    ? getCaretCoordinates(inputRef.current, inputRef.current.selectionEnd)
    : { top: 0, height: 0 };
  const [ showAutocomplete, setShowAutocomplete ] = useState(false);
  const { refine: search } = useSearchBox();

  const getActive = () => {
    const { value: text, selectionEnd = 0 } = inputRef.current;
    const { word, range } = getActiveToken(text || '', selectionEnd);
    return { word, range, text };
  }

  const handleInput = () => {
    const { word } = getActive();
    const shouldOpenAutocomplete = /^@\w{1,15}$/.test(word);
    setShowAutocomplete(shouldOpenAutocomplete);
    showAutocomplete && search(word.slice(1));
  }

  const handleSelection = (userHandle) => {
    const { word, range, text } = getActive();
    const [ index ] = range;
    const prefix = text.substring(0, index);
    const sufix = text.substring(index + word.length);
    const newText = `${prefix}@${userHandle} ${sufix}`;
    setShowAutocomplete(false);
    inputRef.current.value = newText;
    inputRef.current.focus();
  }

  return (
    <main className='container'>

      <section className='box'>
        <div className='box-body'>

          <aside className='box-avatar'>
            <img src='https://static-cdn.jtvnw.net/jtv_user_pictures/d8e1e9d8-7dd3-4fee-8fa5-62a7f6ca320e-profile_image-300x300.png' alt='livcode' />
          </aside>

          <div className='box-compose'>
            <form>
              <textarea
                placeholder='¿Qué está pasando?'
                className='box-textbox'
                ref={inputRef}
                onKeyUp={handleInput}
                onClick={() => {}}
              />
            </form>
            {
              showAutocomplete && <>
                <AutoComplete top={`${top + height}px`} handleSelection={handleSelection} />
              </>
            }
          </div>
        </div>

        <footer className='box-footer'>
          <button type='submit' className='tweet-button'>
            Twittear
          </button>
        </footer>

      </section>
    </main>
  )
}

export default App
