import './ChatWindow.css';
import Chat from './Chat.jsx';

function ChatWindow(){
    return(
        <>
            <div className='chatWindow'>
                <div className='navbar'>
                    <span>ApnaGPT<i class="fa-solid fa-angle-down"></i></span>
                    <div className="userIconDiv">
                        <span className='userIcon'><i class="fa-solid fa-user"></i></span>
                    </div>
                </div>
                <Chat />
                <div className="chatInput">
                    <div className="inputBox">
                        <input placeholder='Ask anything'>

                        </input>
                        <div id='submit'>
                            <i class="fa-solid fa-paper-plane"></i>
                        </div>
                    </div>
                    <div className="info">
                        ApnaGPT can makes mistakes, check important info. See Cookie Preferences.
                    </div>
                </div>

            </div>
        </>
    )
}

export default ChatWindow;