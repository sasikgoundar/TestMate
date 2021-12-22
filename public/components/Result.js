var questions;

var result;

const getResult = async () => {
   try {
      let response = await axios.get(`/getResult/${resultId}`);

      result = response.data;
      questions = result.submittedQAs;
   } catch (err) {
      console.log(err);
   }
};

getResult().then(() => {
   ReactDOM.render(<Result />, document.querySelector('#root'));
});

function Result() {
   const [currentQuestion, setCurrentQuestion] = React.useState(0);
   // const [showScore, setShowScore] = React.useState(false);

   function changeCurrentQuestion(quesno) {
      setCurrentQuestion(quesno);
   }

   return (
      <div className="container-fluid">
         <div className="row">
            <QuestionListPanel changeCurrentQuestion={changeCurrentQuestion} />
            <QuestionDetailPanel currentQuestion={currentQuestion} />
         </div>
      </div>
   );
}

function QuestionListPanel({ changeCurrentQuestion }) {
   let accuracy =
      (result.correctQues / (result.correctQues + result.wrongQues)) * 100;

   accuracy = accuracy.toFixed(1);

   return (
      <div className="container col-md-5 border border-black pt-4 pl-3 pr-3 text-center">
         <div className="uploadBox">
            <h4 className="color">RESULT FOR {result.userfullname}</h4>
            <hr />
            <br />
            <div className="row">
               <div className="col">
                  <div
                     className="card border-info bg-light mb-3 text-center"
                     style={{ maxWidth: '18rem' }}
                  >
                     <div className="card-header">Marks</div>
                     <div className="card-body d-flex justify-content-center">
                        <h3>
                           {result.marksObtained} / {testTotalMarks}
                        </h3>
                     </div>
                  </div>
               </div>
               <div className="col">
                  <div
                     className="card border-success bg-light text-center mb-3"
                     style={{ maxWidth: '18rem' }}
                  >
                     <div className="card-header">Correct Answers</div>
                     <div className="card-body d-flex justify-content-center">
                        <h3>{result.correctQues}</h3>
                     </div>
                  </div>
               </div>
               <div className="col">
                  <div
                     className="card border-danger bg-light text-center mb-3"
                     style={{ maxWidth: '18rem' }}
                  >
                     <div className="card-header">Wrong Answers</div>
                     <div className="card-body d-flex justify-content-center">
                        <h3>{result.wrongQues}</h3>
                     </div>
                  </div>
               </div>
               <div className="col">
                  <div
                     className="card border-warning bg-light text-center mb-3"
                     style={{ maxWidth: '18rem' }}
                  >
                     <div className="card-header">Accuracy</div>
                     <div className="card-body d-flex justify-content-center">
                        <h3>{accuracy}%</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <hr />
         <div
            className="mb-3"
            style={{
               display: 'flex',
               justifyContent: 'space-between',
               fontSize: '1.1rem',
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
               Maximum marks:{' '}
               <span className="badge badge-primary">{testTotalMarks}</span>
            </span>
         </div>
         <ul
            style={{ listStyleType: 'none' }}
            id="questions"
            className="container"
         >
            {questions.map((question, index) => {
               var style;
               if (!question.submittedOption) {
                  //didnt attempt
                  style = 'mb-2 bg-light';
               } else if (question.correctOption == question.submittedOption) {
                  style = 'mb-2 correct';
               } else {
                  style = 'mb-2 wrong';
               }
               return (
                  <li key={index}>
                     <button
                        onClick={() => {
                           // console.log(index);
                           changeCurrentQuestion(index);
                        }}
                        id="questionno"
                        className={style}
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

function QuestionDetailPanel({ currentQuestion, changeCurrentQuestion }) {
   const questionBoxes = questions.map((question, index) => {
      return <QuestionBox key={index} qNumber={index} question={question} />;
   });

   return (
      <div className="col-md-7 mt-3">
         <div className="container">
            <h2 className="text-center">{testName}</h2>
            <hr />
            {questionBoxes[currentQuestion]}
         </div>
         <hr />

         <div style={{ height: '20vh', position: 'relative' }}>
            <button
               onClick={() => {
                  window.location.href = `/leaderboard/${testId}`;
               }}
               className="btn btn-outline-primary mt-auto"
               style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  msTransform: 'translate(-50%, -50%)',
                  transform: 'translate(-50%, -50%)',
                  width: '40%',
                  fontSize: '1.2rem',
               }}
            >
               View Leaderboard &nbsp;&nbsp;&nbsp;
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={36}
                  height={36}
                  fill="currentColor"
                  className="bi bi-trophy-fill"
                  viewBox="0 0 16 16"
               >
                  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
               </svg>
            </button>
         </div>
      </div>
   );
}

function QuestionBox({
   //props
   qNumber,
   question,
}) {
   var style;
   // if (!question.submittedOption) {
   //    //didnt attempt
   //    style = 'input-group-text';   }
   if (question.correctOption == question.submittedOption) {
      style = 'correct';
   } else {
      style = 'wrong';
   }

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
               <div className="input-group input-group-lg">
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           question.submittedOption == 'A' ? style : ''
                        } ${question.correctOption == 'A' ? 'correct' : ''} `}
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
               <div className="input-group input-group-lg">
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           question.submittedOption == 'B' ? style : ''
                        } ${question.correctOption == 'B' ? 'correct' : ''} `}
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
               <div className="input-group input-group-lg">
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           question.submittedOption == 'C' ? style : ''
                        } ${question.correctOption == 'C' ? 'correct' : ''} `}
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
               <div className="input-group input-group-lg">
                  <div className="input-group-prepend">
                     <span
                        style={{ fontSize: '1em' }}
                        className={`input-group-text ${
                           question.submittedOption == 'D' ? style : ''
                        } ${question.correctOption == 'D' ? 'correct' : ''} `}
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
      </div>
   );
}
