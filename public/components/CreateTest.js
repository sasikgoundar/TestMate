class Test {
   constructor(
      testname,
      startdatetime,
      lastdatetime,
      timelimit,
      negmarks,
      totalMarks,
      questions,
   ) {
      this.testname = testname;
      this.startdatetime = startdatetime;
      this.lastdatetime = lastdatetime;
      this.timelimit = timelimit;
      this.negmarks = negmarks;
      this.totalMarks = totalMarks;
      this.questions = questions;
   }
}

class Question {
   constructor(index) {
      this.index = index;
      this.title = '';
      this.optionA = '';
      this.optionB = '';
      this.optionC = '';
      this.optionD = '';
      this.correctOption = '';
      this.mark = '';
      this.saved = false;
   }
}

const CreateTestComponent = () => {
   const [questions, setQuestions] = React.useState([new Question(1)]);

   const addEmptyQuestion = () => {
      var newQues = new Question(questions.length + 1);
      // newQues.index = questions.length + 1;
      setQuestions((questions) => [...questions, newQues]);
   };

   const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
   // const [showScore, setShowScore] = React.useState(false);

   function changeCurrentQuestionIndex(quesno) {
      console.log('om112');
      console.log(quesno);
      console.log(questions.length);

      if (quesno >= questions.length) {
         setCurrentQuestionIndex(0);
      } else setCurrentQuestionIndex(quesno);
   }

   const saveQuestion = (
      qindex,
      title,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      mark,
   ) => {
      const index = questions.findIndex((ques) => {
         return qindex == ques.index;
      });
      let q = questions[index];
      q.title = title;
      q.optionA = optionA;
      q.optionB = optionB;
      q.optionC = optionC;
      q.optionD = optionD;
      q.correctOption = correctOption;
      q.mark = parseInt(mark);
      q.saved = true;
      // test.totalMarks += parseInt(mark);
      console.log(questions);
      setQuestions(questions);
      changeCurrentQuestionIndex(currentQuestionIndex + 1);
   };

   function createTest(
      testname,
      startdatetime,
      lastdatetime,
      timelimit,
      negmarks,
   ) {
      for (var i = 0; i < questions.length; i++) {
         if (questions[i].saved == false) {
            return alert('Please save all questions first!');
         }
      }
      let totalMarks = questions.reduce(function (acc, obj) {
         return acc + obj.mark;
      }, 0);
      var newTest = new Test(
         testname,
         startdatetime,
         lastdatetime,
         timelimit,
         negmarks,
         totalMarks,
         questions,
      );
      axios
         .post(`/createTest`, newTest)
         .then((response) => {
            window.location.href = `/test-success/${response.data}`;
         })
         .catch((error) => {
            console.log(error);
         });
   }

   // console.log(questions);
   return (
      <div className="container-fluid">
         <div className="row">
            <AddQuestionPanel
               questions={questions}
               addEmptyQuestion={addEmptyQuestion}
               changeCurrentQuestionIndex={changeCurrentQuestionIndex}
            />
            <div className="col-md-9 mt-3">
               <QuestionDetailPanel
                  key={currentQuestionIndex}
                  currentQuestion={questions[currentQuestionIndex]}
                  saveQuestion={saveQuestion}
               />
               <hr />
               <TestSettings createTest={createTest} />
            </div>
         </div>
      </div>
   );
};

function AddQuestionPanel({
   questions,
   addEmptyQuestion,
   changeCurrentQuestionIndex,
}) {
   // console.log(questions);
   return (
      <div className="container col-md-3 border border-black pt-4 text-center">
         <button
            onClick={addEmptyQuestion}
            id="add-question"
            className="btn btn-outline-primary"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="16"
               height="16"
               fill="currentColor"
               className="bi bi-plus-circle"
               viewBox="0 0 15 17"
            >
               <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
               <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            New Question
         </button>
         <hr />

         <div
            className="mb-5"
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
                           changeCurrentQuestionIndex(index);
                        }}
                        id="questionno"
                        className={`mb-2 ${
                           question.saved ? 'correct' : 'bg-light'
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

function QuestionDetailPanel({ currentQuestion, saveQuestion }) {
   const [inputState, setInputState] = React.useState(currentQuestion);

   const {
      index,
      title,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      mark,
   } = inputState;

   const handleChange = (e) => {
      const { name, value } = e.target;

      setInputState((prevDetails) => {
         return { ...prevDetails, [name]: value };
      });
   };

   const [currentAnswer, setCurrentAnswer] = React.useState(null);
   const setAnswer = (option) => {
      setCurrentAnswer(option);
   };

   return (
      <div className="container">
         <h4 className="mb-3">Question {index}</h4>

         <textarea
            value={title}
            onChange={handleChange}
            name="title"
            id="question-area"
            className="form-control mb-5"
            id="exampleFormControlTextarea1 "
            rows="6 "
            placeholder="Enter your question here.... "
         ></textarea>

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
                           currentAnswer == 'A' || correctOption == 'A'
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option A
                     </span>
                  </div>
                  <input
                     value={optionA}
                     onChange={handleChange}
                     name="optionA"
                     type="text"
                     className="form-control"
                  />
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
                           currentAnswer == 'B' || correctOption == 'B'
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option B
                     </span>
                  </div>
                  <input
                     value={optionB}
                     onChange={handleChange}
                     name="optionB"
                     type="text"
                     className="form-control"
                  />
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
                           currentAnswer == 'C' || correctOption == 'C'
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option C
                     </span>
                  </div>
                  <input
                     value={optionC}
                     onChange={handleChange}
                     name="optionC"
                     type="text"
                     className="form-control"
                  />
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
                           currentAnswer == 'D' || correctOption == 'D'
                              ? 'correct'
                              : ''
                        }`}
                     >
                        Option D
                     </span>
                  </div>
                  <input
                     value={optionD}
                     onChange={handleChange}
                     name="optionD"
                     type="text"
                     className="form-control"
                  />
               </div>
            </div>
         </div>

         <div className="question-bottom">
            <div className="input-group" style={{ alignItems: 'end' }}>
               <div className="input-group-prepend">
                  <span
                     style={{ fontSize: '1em' }}
                     className="input-group-text"
                  >
                     Marks
                  </span>
               </div>
               <input
                  value={mark}
                  onChange={handleChange}
                  name="mark"
                  type="number"
                  className="form-control"
                  style={{ flexGrow: '0.2', marginRight: 'auto' }}
               />
               <div className="float-right">
                  <button
                     onClick={() => {
                        if (
                           title == '' ||
                           optionA == '' ||
                           optionB == '' ||
                           optionC == '' ||
                           optionD == '' ||
                           mark == ''
                        )
                           alert('Fields are blank!');
                        else if (currentAnswer == null)
                           alert('Please choose a correct answer!');
                        else {
                           saveQuestion(
                              index,
                              title,
                              optionA,
                              optionB,
                              optionC,
                              optionD,
                              currentAnswer,
                              mark,
                           );
                        }
                     }}
                     className="btn btn-outline-primary mt-5 mr-3"
                  >
                     Save Question
                  </button>
                  <button
                     onClick={() => {
                        setInputState({
                           index: index,
                           title: '',
                           optionA: '',
                           optionB: '',
                           optionC: '',
                           optionD: '',
                           correctOption: '',
                           mark: '',
                        });
                     }}
                     className="btn btn-danger mt-5 text-right"
                  >
                     Clear All
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

function TestSettings({ createTest }) {
   const [inputState, setInputState] = React.useState({
      testname: '',
      startdatetime: '',
      lastdatetime: '',
      timelimit: '',
      negmarks: 'No',
   });

   const { testname, startdatetime, lastdatetime, timelimit, negmarks } =
      inputState;

   const handleChange = (e) => {
      const { name, value } = e.target;

      setInputState((prevDetails) => {
         return { ...prevDetails, [name]: value };
      });
   };

   console.log(inputState);

   return (
      <div className="container">
         <h3 className="mb-4">Test Settings</h3>
         <div className="row">
            <div className="col-md-4">
               <label htmlFor="date" className="form-label">
                  Test Name<span className="text-danger">*</span>
               </label>
               <input
                  value={testname}
                  onChange={handleChange}
                  className="form-control"
                  name="testname"
                  required
               />
            </div>
            <div className="col-md-3">
               <label htmlFor="date" className="form-label">
                  Start-DateTime<span className="text-danger">*</span>
               </label>
               <input
                  value={startdatetime}
                  onChange={handleChange}
                  onBlur={handleChange}
                  className="form-control"
                  id="datetimepickerstart"
                  name="startdatetime"
                  required
               />
            </div>
            <div className="col-md-3">
               <label htmlFor="date" className="form-label">
                  Last-DateTime<span className="text-danger">*</span>
               </label>
               <input
                  value={lastdatetime}
                  onChange={handleChange}
                  onBlur={handleChange}
                  className="form-control"
                  id="datetimepickerend"
                  name="lastdatetime"
                  required
               />
            </div>
            <div className="col-md-2">
               <label htmlFor="date" className="form-label">
                  Time-Limit (minutes)<span className="text-danger">*</span>
               </label>
               <input
                  value={timelimit}
                  onChange={handleChange}
                  className="form-control"
                  type="number"
                  name="timelimit"
                  required
               />
            </div>
            <div className="col-md-3 mt-3">
               <label htmlFor="exampleFormControlSelect1">
                  Negative Marking
               </label>
               <select
                  value={negmarks}
                  onChange={handleChange}
                  className="form-control"
                  id="exampleFormControlSelect1"
                  name="negmarks"
               >
                  <option defaultValue>No</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
               </select>
            </div>
         </div>
         <button
            onClick={() => {
               // alert('hi');
               createTest(
                  testname,
                  startdatetime,
                  lastdatetime,
                  timelimit,
                  negmarks,
               );
            }}
            className="btn btn-primary mt-4 pl-4 pr-4"
         >
            CREATE TEST
         </button>
      </div>
   );
}

const successModal = () => {
   return (
      <div
         className="modal fade"
         id="exampleModal"
         tabIndex={-1}
         aria-labelledby="exampleModalLabel"
         aria-hidden="true"
      >
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                     SUCCESS
                  </h5>
                  <button
                     type="button"
                     className="close"
                     data-dismiss="modal"
                     aria-label="Close"
                  >
                     <span aria-hidden="true">×</span>
                  </button>
               </div>
               <div className="modal-body text-center ">
                  <div className="alert alert-success">
                     TEST HAS BEEN CREATED.
                  </div>
               </div>
               <div
                  className="modal-footer text-center"
                  style={{ display: 'block' }}
               >
                  <p>CODE FOR JOINING THE TEST :</p>
                  <div style={{ fontSize: '2.5rem' }}>qwdqadwq7464</div>
               </div>
            </div>
         </div>
      </div>
   );
};

ReactDOM.render(<CreateTestComponent />, document.querySelector('#root'));
