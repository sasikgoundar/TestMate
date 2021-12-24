var fetchedQuestions;

const getQuestions = async () => {
   try {
      let response = await axios.get(`/getQuestions/${testId}`);
      fetchedQuestions = response.data.questions;
      // console.log(questions);
   } catch (err) {
      console.log(err);
   }
};

getQuestions().then(() => {
   ReactDOM.render(<AttemptTest />, document.querySelector('#root'));
});

// const questions = [
//    {
//       _id: 'aa123',
//       title: 'color of water',
//       optionA: 'red',
//       optionB: 'blue',
//       optionC: 'green',
//       optionD: 'none',
//       correctOption: 'D',
//       mark: 5,
//    },
//    {
//       _id: 'bb123',
//       title: 'color of land',
//       optionA: 'red',
//       optionB: 'blue',
//       optionC: 'green',
//       optionD: 'none',
//       correctOption: 'A',
//       mark: 10,
//    },
//    {
//       _id: 'cc123',
//       title: 'color of sky',
//       optionA: 'red',
//       optionB: 'blue',
//       optionC: 'green',
//       optionD: 'none',
//       correctOption: 'B',
//       mark: 15,
//    },
// ];

function AttemptTest() {
   const [questions, setQuestions] = React.useState(fetchedQuestions);
   // console.log('questions');
   // console.log(questions);

   const [currentQuestion, setCurrentQuestion] = React.useState(0);
   // const [showScore, setShowScore] = React.useState(false);

   function changeCurrentQuestion(quesno) {
      setCurrentQuestion(quesno);
   }

   const saveAnswerFunc = (quesId, selectedOption) => {
      if (!selectedOption) {
         alert('Please select an option!');
         return;
      }

      //save selected ans into question
      // console.log(questions);

      const index = questions.findIndex((ques) => {
         return quesId == ques._id;
      });

      //means user is editing their previous saved option
      questions[index].submittedOption = selectedOption;
      setQuestions(questions);
      // then move to next question
      changeCurrentQuestion(currentQuestion + 1);
   };

   return (
      <div className="container-fluid">
         <div className="row">
            <QuestionListPanel
               questions={questions}
               changeCurrentQuestion={changeCurrentQuestion}
            />
            <QuestionDetailPanel
               questions={questions}
               saveAnswerFunc={saveAnswerFunc}
               currentQuestion={currentQuestion}
               changeCurrentQuestion={changeCurrentQuestion}
            />
         </div>
      </div>
   );
}

function QuestionListPanel({ questions, changeCurrentQuestion }) {
   return (
      <div className="container col-md-3 border border-black pt-4 text-center">
         <Timer timelimit={timeLimit} />
         <hr />
         <div
            className="mb-3"
            style={{
               display: 'flex',
               justifyContent: 'space-between',
               fontSize: '1.3rem',
            }}
         >
            <span>
               Total questions:{' '}
               <span className="badge badge-primary">{questions.length}</span>
            </span>
            <span>
               Negative Marking:{' '}
               <span className="badge badge-primary">
                  {negativeMarks} per wrong
               </span>
            </span>
            <span>
               Total marks:{' '}
               <span className="badge badge-primary">
                  {questions.reduce(function (acc, obj) {
                     return acc + obj.mark;
                  }, 0)}
               </span>
            </span>
         </div>
         <ul
            style={{ listStyleType: 'none' }}
            id="questions"
            className="container"
         >
            {questions.map((question, index) => {
               return (
                  <li key={index}>
                     <button
                        onClick={() => {
                           // console.log(index);
                           changeCurrentQuestion(index);
                        }}
                        id="questionno"
                        className={`mb-2 ${
                           question.submittedOption ? 'correct' : 'bg-light'
                        }`}
                     >
                        Question {index + 1}
                     </button>
                  </li>
               );
            })}
         </ul>
      </div>
   );
}

function QuestionDetailPanel({ questions, saveAnswerFunc, currentQuestion }) {
   function submitTest() {
      axios
         .post(`/attemptTest/${testId}`, questions)
         .then((response) => {
            window.location.href = `/testattempt-success/${response.data}`;
         })
         .catch((error) => {
            console.log(error);
         });
   }

   const questionBoxes = questions.map((question, index) => {
      return (
         <QuestionBox
            key={index}
            qNumber={index}
            question={question}
            saveAnswerFunc={saveAnswerFunc}
         />
      );
   });

   return (
      <div className="col-md-9 mt-3">
         <div className="container">
            <h2 className="text-center">{testName}</h2>
            <hr />
            {questionBoxes[currentQuestion]}
         </div>
         <hr />
         <div className="text-center">
            <button
               className="btn btn-primary mt-2"
               style={{ width: '50%' }}
               onClick={submitTest}
            >
               SUBMIT TEST
            </button>
         </div>
      </div>
   );
}

function QuestionBox({
   //props
   qNumber,
   question,
   saveAnswerFunc,
}) {
   const [currentAnswer, setCurrentAnswer] = React.useState(null);

   const setAnswer = (option) => {
      setCurrentAnswer(option);
   };

   return (
      <div>
         <div
            className="mb-3"
            style={{ display: 'flex', justifyContent: 'space-between' }}
         >
            <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>
               Question {qNumber + 1}
            </span>
            <span className="pt-2 pr-1 text-large">
               <span className="badge badge-primary">
                  Marks: {question.mark}
               </span>
            </span>
         </div>
         <textarea
            id="question-area"
            className="form-control mb-5"
            rows={4}
            style={{ fontSize: '1.3rem' }}
            disabled
            value={question.title}
            // onChange={handleChange}
         />
         <div className="row">
            <div className="col-md-6">
               <div
                  className="input-group input-group-lg"
                  onClick={() => {
                     setAnswer('A');
                  }}
               >
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           currentAnswer == 'A' ||
                           (question.submittedOption &&
                              question.submittedOption == 'A')
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option A
                     </span>
                  </div>
                  <span id="optionA" className="form-control">
                     {question.optionA}
                  </span>
               </div>
            </div>
            <div className="col-md-6">
               <div
                  className="input-group input-group-lg"
                  onClick={() => {
                     setAnswer('B');
                  }}
               >
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           currentAnswer == 'B' ||
                           (question.submittedOption &&
                              question.submittedOption == 'B')
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option B
                     </span>
                  </div>
                  <span id="optionB" className="form-control">
                     {question.optionB}
                  </span>
               </div>
            </div>
         </div>
         <div className="row mt-5">
            <div className="col-md-6">
               <div
                  className="input-group input-group-lg"
                  onClick={() => {
                     setAnswer('C');
                  }}
               >
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           currentAnswer == 'C' ||
                           (question.submittedOption &&
                              question.submittedOption == 'C')
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option C
                     </span>
                  </div>
                  <span id="optionC" className="form-control">
                     {question.optionC}
                  </span>
               </div>
            </div>
            <div className="col-md-6">
               <div
                  className="input-group input-group-lg"
                  onClick={() => {
                     setAnswer('D');
                  }}
               >
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           currentAnswer == 'D' ||
                           (question.submittedOption &&
                              question.submittedOption == 'D')
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option D
                     </span>
                  </div>
                  <span id="optionD" className="form-control">
                     {question.optionD}
                  </span>
               </div>
            </div>
         </div>
         <button
            className="btn btn-outline-primary mt-5"
            onClick={() => {
               saveAnswerFunc(question._id, currentAnswer);
            }}
         >
            Save Answer
         </button>
      </div>
   );
}

const Timer = React.memo(function Timer({ timelimit }) {
   React.useEffect(() => {
      StartTimer();
   });

   function StartTimer() {
      //COUNTDOWN TIMER
      var minutes = timelimit;

      var target_date = new Date().getTime() + minutes * 60 * 1000; // set the countdown date
      var time_limit = minutes * 60 * 1000;
      //set actual timer
      setTimeout(function () {
         alert('TIME OVER! Auto Submitting Now..');

         axios
            .post(`/attemptTest/${testId}`, questions)
            .then((response) => {
               console.log(response.data);
            })
            .catch((error) => {
               console.log(error);
            });
         window.location.href = '/home';
      }, time_limit);

      var days, hours, minutes, seconds; // variables for time units

      var countdown = document.getElementById('tiles'); // get tag element

      getCountdown();

      setInterval(function () {
         getCountdown();
      }, 1000);

      function getCountdown() {
         // find the amount of "seconds" between now and target
         var current_date = new Date().getTime();
         var seconds_left = (target_date - current_date) / 1000;

         if (seconds_left >= 0) {
            if (seconds_left * 1000 < time_limit / 2) {
               $('#tiles').removeClass('color-full');
               $('#tiles').addClass('color-half');
            }
            if (seconds_left * 1000 < time_limit / 4) {
               $('#tiles').removeClass('color-half');
               $('#tiles').addClass('color-empty');
            }

            days = pad(parseInt(seconds_left / 86400));
            seconds_left = seconds_left % 86400;

            hours = pad(parseInt(seconds_left / 3600));
            seconds_left = seconds_left % 3600;

            minutes = pad(parseInt(seconds_left / 60));
            seconds = pad(parseInt(seconds_left % 60));

            // format countdown string + set tag value
            countdown.innerHTML =
               '<span>' +
               hours +
               ':</span><span>' +
               minutes +
               ':</span><span>' +
               seconds +
               '</span>';
         }
      }
      function pad(n) {
         return (n < 10 ? '0' : '') + n;
      }
   }

   return (
      <div>
         <input type="hidden" id="set-time" defaultValue={1} />
         <div id="countdown">
            <div id="tiles" className="color-full" />
            <div className="countdown-label">Time Remaining</div>
         </div>
      </div>
   );
});
