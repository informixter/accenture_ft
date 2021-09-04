import React, {useState} from 'react';
import {useRequest} from "../helper";
import {questions} from "../questions";
import {LEVELS_INFO, setLevel, setScreen} from "../ducks/main";
import IconBack from "../components/icons/IconBack";

export default function TestScreen ({})
{
    const {requestLoading, request} = useRequest();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
    const [balls, setBalls] = useState(0);
    const [finished, setFinished] = useState(false);
    const [localLevel, setLocalLevel] = useState(null);

    function nextQuestion ()
    {
    	const newBalls = balls + questions[currentQuestionIndex].variants[selectedVariantIndex].balls;
	    setBalls(newBalls);
    	if (currentQuestionIndex + 1 < questions.length)
	    {
		    setCurrentQuestionIndex(currentQuestionIndex + 1);
		    setSelectedVariantIndex(null);
	    }
    	else
	    {
		    setFinished(true);

		    // баллы зависят от вопросов. контент вопросов не так важен, как реализация.
		    if (newBalls === 0)
		    {
			    setLevel("LOW");
		    }
		    else if (newBalls === 1)
		    {
			    setLevel("MEDIUM");
		    }
		    else if (newBalls === 2)
		    {
			    setLevel("HIGH");
		    }
		    setScreen("MAIN");
	    }
    }

    return <div className={`screen`}>

        <div className="screen-body pt-0">

	        <div onClick={() => setScreen("MAIN")}>
		        <IconBack/>
	        </div>

	        {
	        	currentQuestionIndex === null &&
		        <>
			        <h1>Пройдите тест</h1>
			        <p className="text-muted">Чтобы определить ваш инвестиционный уровень риска.</p>
			        <button onClick={() => setCurrentQuestionIndex(0)} className="btn btn-primary">Начать тест</button>
		        </>
	        }

	        {
		        currentQuestionIndex !== null && !finished &&
		        <>
			        <h1>Вопрос {currentQuestionIndex + 1}</h1>
			        <p className="text-muted">{questions[currentQuestionIndex].text}</p>

			        {
				        questions[currentQuestionIndex].variants.map((_, index) =>
					        <div key={index} className="d-block custom-control custom-radio custom-control-inline">
						        <div className="form-group mb-0">
							        <input checked={selectedVariantIndex === index} onChange={() => setSelectedVariantIndex(index)} type="radio" id={`radio-${currentQuestionIndex}-${index}`} name="customRadio"
							               className="custom-control-input"/>
								        <label className="custom-control-label" htmlFor={`radio-${currentQuestionIndex}-${index}`}>{_.text}</label>
						        </div>
					        </div>)
			        }

			        <button disabled={selectedVariantIndex === null} onClick={nextQuestion} className="btn btn-primary mt-4">Дальше</button>
		        </>
	        }

	        {
	        	finished && localLevel &&
		        <>
			        <h1>Вы - {LEVELS_INFO[localLevel].title}</h1>
			        <p className="text-muted">{LEVELS_INFO[localLevel].text}</p>
			        <button onClick={() => {setLevel(localLevel);setScreen("MAIN")}} className="btn btn-primary">Завершить тестирование</button>
		        </>
	        }
        </div>

    </div>
}
