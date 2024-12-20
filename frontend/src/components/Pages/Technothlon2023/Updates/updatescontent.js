import React from 'react';
import './updatescontent.css'
const UpdatesContent = () => {
  return (
    <div class="main">
    <div class ="jumbotron">
    <div >
        <p class = "first">Updates</p>
    </div>
    <div class = "small-separator">
        <p class="gi">General Instructions</p>
    </div>
    
    <div class = "instruction">
        <div >
            <p class = "prelims24">Instruction For Prelims 2024</p>
        </div>
        <div >
            <ul>
                <li>The exam will be conducted on <b>23rd July,2023</b>, on Sunday.</li>
                <li>The exam will be <b>online</b>, and participants can give the test through any device
                    (Mobile,Laptop,Tab,PC)</li>
                <li>Please make sure you use the same registered mobile number,email and name while giving 
                    exam.</li>
                <li>Only indivual participation allowed.</li>
                <li>Multiple registrations with the same mobile number not allowed.</li>
                <li>Test link will be updated here at the right time.</li>
                <li>Multi-device login at the time of attempting is strictly restricted.</li>
                <li>Any sort of disturbance to the test window will be treated as a violation,it can be any
                    of the following:
                    <ol>
                        <li>Tab Switching</li>
                        <li>Pressing the escape button</li>
                        <li>Capturing screenshots or screen sharing</li>
                        <li>Computer going to sleep(adjust your power/sleep mode setting)</li>
                    </ol>
                </li>
                <li>The final results will be announced by Team Technothlon on our website-<a></a></li>
                <li>The results declared by our team would be final and no queries regarding re-evaluation
                    will be entertained.
                </li>
                <li>But you can always write to us in case you find any error/issue in any of the questions.</li>
                <li>Follow our social handles for more updates.</li>
            </ul>
        </div>
        
    </div>

    </div>
    </div>
  );
};

export default UpdatesContent;