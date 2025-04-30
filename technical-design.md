

# Flashcards

In this project, you will practice using Redux and Redux Toolkit to manage the complex state of a flashcard-style quiz app. Users will be able to create their own topics, quizzes for those topics, and flashcards for those quizzes. Users will also be able to interact with their quizzes by flipping flashcards over.

The following task descriptions will walk through implementing the app’s Redux logic, starting with topics, then quizzes, and then cards.

## Task 1.

This app uses uuidv4() function from the uuid package to create unique identifiers for topics/quizzes/cards.

## Task 2.

This app uses react-router to handle routing between different pages. We’ve written the routing code for you:

```js

<BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="topics" element={<Topics />} />
          <Route path="topics/new" element={<NewTopicForm />} />
          <Route path="topics/:topicId" element={<Topic />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/new" element={<NewQuizForm />} />
          <Route path="quizzes/:quizId" element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>

```

## Task 3.

At a high level, your application will be able to handle the following URL routes, each with their own functionality:

On the '/topics/new' page:

- Users can create topics

On the '/topics' page: * Users can view all topics * Users can click on an individual topic and be redirected to the page for that topic

On the /topics/:topicId page:

- Users can view an individual topic and all quizzes for that topic * Users can click on a quiz associated with a topic and be redirected to that quiz’s page

On the 'quizzes/new' page:

- Users can create quizzes that are associated with topics and contain lists of flashcards * Users can add and remove card fields in the new quiz form

On the '/quizzes' page:

- Users can view all quizzes * Users can click on an individual quiz and be redirected to that quiz’s page

On the '/quizzes/:quizId' page:

- Users can view an individual quiz and flip cards over

## Task 4.

Before you start writing code, take a moment to review our recommended state structure:

- Your app will include three slices: one for topics, one for quizzes, and one for cards.

- Each slice’s state should include an object storing all the topics/quizzes/cards keyed by their id. This will allow you to quickly retrieve an object’s information whenever you need to look it up.

- Each individual quiz will have a topicId value corresponding to an individual topic in state.

- Similarly, each topic which will have a quizIds array corresponding to the associated quizzes in state.

All together, your app state will look like this:

```js

{
  topics: {
    topics: {
      '123': {
        id: '123',
        name: 'example topic',
        icon: 'icon url',
        quizIds: ['456']
      }
    }
  },
  quizzes: {
    quizzes: {
      '456': {
        id: '456',
        topicId: '123',
        name: 'quiz for example topic',
        cardIds: ['789', '101', '102']
      }
    }
  },
  cards: {
    cards: {
      '789': {
        id: '789',
        front: 'front text',
        back: 'back text'
      },
      '101': {
        id: '101',
        front: 'front text',
        back: 'back text'
      },
      '102': {
        id: '102',
        front: 'front text',
        back: 'back text'
      },
    }
  }
}

```

## Task 5.

Your first task is to write code to manage the state associated with topics. In the src/features/topics directory, create a new file containing a slice that:

- Is named topicsSlice.

- Has initial state consisting of an object that includes one property, topics, which corresponds to an empty object. This inner topics object will eventually hold all topics keyed by id.

- Has an addTopic action. You can expect the payload for this action to look like {id: '123456', name: 'name of topic', icon: 'icon url'}. Store these values in the state as a new topic object.

- Each topic object added to the state should also have a quizIds property, which will correspond to an array containing the ids of each quiz associated with the topic. When a topic is first created, it won’t have any associated quizzes, but you should still create an empty quizIds array so that all topics in the state conform to the same shape.

- Create a selector that selects the topics object nested within initialState.

- Export the selector as well as the action creators and reducer that your slice generates.

## Task 6.

Add the topics slice to the app’s store.

```js

import { configureStore } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
// import reducers

export default configureStore({
  reducer: {
    
  },
});

```

## Task 7.

In src/features/topics/Topics.js, import the selector defined in your slice and use it to access all the topics in state, and replace the empty object currently assigned to topics with the topics in state.

```js

import React from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
// import selector

export default function Topics() {
  const topics = {}; // replace this with a call to your selector to select all the topics in state

  return (
    <section className="center">
      <h1>Topics</h1>
      <ul className="topics-list">
        {Object.values(topics).map((topic) => (
          <li className="topic" key={topic.id}>
          <Link to={ROUTES.topicRoute(topic.id)} className="topic-link">
           <div className="topic-container">
             <img src={topic.icon} alt="" />
             <div className="text-content">
               <h2>{topic.name}</h2>
               <p>{topic.quizIds.length} Quizzes</p>
             </div>
           </div>
         </Link>
          </li>
        ))}
      </ul>
      <Link
        to={ROUTES.newTopicRoute()}
        className="button create-new-topic-button"
      >
        Create New Topic
      </Link>
    </section>
  );
}

```

## Task 8.

Next, you’ll need to hook the new topic form up to the action creators your slice generates. In src/components/NewTopicForm.js, import addTopic and dispatch it from the event handler that runs when the new topic form is submitted.

Verify that your code is working by filling out the form and submitting it. You should be redirected to the /topics page and should see your newly created topic there.

```js

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
import { ALL_ICONS } from "../data/icons";
// import addTopic

export default function NewTopicForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) {
      return;
    }

    // dispatch new topic
    navigate(ROUTES.topicsRoute());
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1 className="center">Create a new topic</h1>
        <div className="form-section">
          <input
            id="topic-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Topic Name"
          />
          <select
            onChange={(e) => setIcon(e.currentTarget.value)}
            required
            defaultValue="default"
          >
            <option value="default" disabled hidden>
              Choose an icon
            </option>
            {ALL_ICONS.map(({ name, url }) => (
              <option key={url} value={url}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <button className="center" type="submit">Add Topic</button>
      </form>
    </section>
  );
}

```

## Task 9.

Great work! Now that you can create topics, your next task is to build out the necessary functionality to add quizzes to your app. This will involve creating two new slices—one for the quizzes themselves and one for the cards that comprise them—and adding an action to your topics slice to associate quizzes with the topic to which they belong. To start, create in the src/features/quizzes directory, create a new file containing a slice for quizzes that:

- Is named 'quizzesSlice'

- Has initial state consisting of an object that includes one property, quizzes, which corresponds to an empty object. This inner quizzes object will eventually hold all quizzes keyed by id.

- Has an addQuiz action. This action will receive a payload of the form { id: '123', name: 'quiz name', topicId: '456', cardIds: ['1', '2', '3', ...]}.

- Has a selector which returns all quizzes from state.

- Export the selector as well as the action creators and reducer that your slice generates.

- Is added to the store.

## Task 10.

Next, you should add an action to your topics slice that adds a quiz’s id to the quizIds array of the topic with which the newly created quiz is associated. This action will receive the same payload the quizzes slice addQuiz action received in the form { id: '123', name: 'quiz name', topicId: '456', cardIds: ['1', '2', '3', ...]}.

## Task 11.

To test your work, you’ll need to connect your action creator to src/components/NewQuizForm and make sure the component works. First, import your topics selector from your topics slice and replace the variable topics, which is currently assigned an empty object, with a call to that selector.

```js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
// import selectors

export default function NewQuizForm() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();
  const topics = {};  // Replace with topics 
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) {
      return;
    }

    const cardIds = [];

    // create the new cards here and add each card's id to cardIds
    // create the new quiz here

    const quizId = uuidv4();

    // dispatch add quiz action 

    navigate(ROUTES.quizzesRoute())
  };

  const addCardInputs = (e) => {
    e.preventDefault();
    setCards(cards.concat({ front: "", back: "" }));
  };

  const removeCard = (e, index) => {
    e.preventDefault();
    setCards(cards.filter((card, i) => index !== i));
  };

  const updateCardState = (index, side, value) => {
    const newCards = cards.slice();
    newCards[index][side] = value;
    setCards(newCards);
  };

  return (
    <section>
      <h1>Create a new quiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="quiz-name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Quiz Title"
        />
        <select
          id="quiz-topic"
          onChange={(e) => setTopicId(e.currentTarget.value)}
          placeholder="Topic"
        >
          <option value="">Topic</option>
          {Object.values(topics).map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        {cards.map((card, index) => (
          <div key={index} className="card-front-back">
            <input
              id={`card-front-${index}`}
              value={cards[index].front}
              onChange={(e) =>
                updateCardState(index, "front", e.currentTarget.value)
              }
              placeholder="Front"
            />

            <input
              id={`card-back-${index}`}
              value={cards[index].back}
              onChange={(e) =>
                updateCardState(index, "back", e.currentTarget.value)
              }
              placeholder="Back"
            />

            <button
              onClick={(e) => removeCard(e, index)}
              className="remove-card-button"
            >
              Remove Card
            </button>
          </div>
        ))}
        <div className="actions-container">
          <button onClick={addCardInputs}>Add a Card</button>
          <button type="submit">Create Quiz</button>
        </div>
      </form>
    </section>
  );
}

```

## Task 12.

Next, import the action from your quiz slice and dispatch it from the handleSubmit() event handler that fires when the new quiz form is submitted.

- Remember, that action creator expects to receive a payload of the form { id: '123', name: 'quiz name', topicId: '456', cardIds: ['1', '2', '3', ...]}. You’ll have to generate an id by calling uuidv4. For now, pass the empty cardIds array variable for the cardIds property (you’ll change that in a later task).

- Test that your action creator works by filling out the new quiz form. After your quiz is created you should be rerouted to the /quizzes page and should see your newly created quiz there.

## Task 13.

Lastly, import your selector in src/features/quizzes/Quizzes.js, src/features/quizzes/Quiz.js, and src/features/topics/Topic.js and make sure those components are displaying the correct data:

- The Quizzes component should render a Link for each quiz value in the quizzes slice of state.

- The Quiz component uses the react-router-dom method useParams() to determine the quizId to render. Therefore, it needs the full set of quizzes to find the appropriate quiz object to render.

- The Topic component should replace the empty object assigned to quizzes with the selector.

### Quizzes.js

```js

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
// import quiz selector

export default function Quizzes() {
  const quizzes = {}; // replace this with a call to your selector to get all the quizzes in state
  return (
    <section className="center">
      <h1>Quizzes</h1>
      <ul className="quizzes-list">
        {Object.values(quizzes).map((quiz) => (
          <Link key={quiz.id} to={ROUTES.quizRoute(quiz.id)}>
            <li className="quiz">{quiz.name}</li>
          </Link>
        ))}
      </ul>
      <Link to={ROUTES.newQuizRoute()} className="button">
        Create New Quiz
      </Link>
    </section>
  );
}

```

### Quiz.js

```js

import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams, Navigate } from "react-router-dom";
import Card from "../cards/Card";
import ROUTES from "../../app/routes";
// import quiz selector

export default function Quiz() {
  const quizzes = {}; // replace this with a call to your selector to get all the quizzes in state
  const { quizId } = useParams();
  const quiz = quizzes[quizId];

  if(!quiz) {
    return <Navigate to={ROUTES.quizzesRoute()} replace/>
  }


  return (
    <section>
      <h1>{quiz.name}</h1>
      <ul className="cards-list">
        {quiz.cardIds.map((id) => (
          <Card key={id} id={id} />
        ))}
      </ul>
      <Link to={ROUTES.newQuizRoute()} className="button center">
        Create a New Quiz
      </Link>
    </section>
  );
}

```

### Topic.js

```js

import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams, Navigate } from "react-router-dom";
import ROUTES from "../../app/routes";
// import selectors

export default function Topic() {
  const topics = {};  // replace with selector
  const quizzes = {}; // replace with selector
  const { topicId } = useParams();
  const topic = topics[topicId];

  if(!topic) {
    return <Navigate to={ROUTES.topicsRoute()} replace/>
  }
  
  const quizzesForTopic = topic.quizIds.map((quizId) => quizzes[quizId]);

  return (
    <section>
      <img src={topic.icon} alt="" className="topic-icon" />
      <h1>{topic.name}</h1>
      <ul className="quizzes-list">
        {quizzesForTopic.map((quiz) => (
          <li className="quiz" key={quiz.id}>
            <Link to={ROUTES.quizRoute(quiz.id)}>{quiz.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/quizzes/new" className="button center">
        Create a New Quiz
      </Link>
    </section>
  );
}

```

## Task 14.

Great work! Next, in the src/features/cards directory, create a new file containing slice for cards that:

- Is named 'cardsSlice'

- Has initial state consisting of an object that includes one property, cards, which corresponds to an empty object. This inner cards object will eventually hold all cards keyed by id.

- Has an addCard action. This action will receive a payload of the form { id: '123', front: 'front of card', back: 'back of card'}.

- Has a selector that returns a card with the given id.

- Is added to the store.

## Task 15.

Lastly, connect your addCard action creator to the new quiz form. In src/components/NewQuizForm, in the event handler that fires when the quiz form is submitted, iterate through the cards in that form’s local state, and for each one:

- dispatch your addCard action creator. You will have to generate an id for each card using uuidv4.

- Store the id you create for each card in the cardIds array we’ve provided for you. Remember, your action creator expects to receive a payload of the form { id: '123', front: 'front of card', back: 'back of card'}. You want to collect all the cardIds in an array so that you can pass them to the action creator that generates new quizzes. To use uuidv4 to create an id, call the function like so: uuidv4().

## Task 16.

You previously passed an empty array for cardIds to the action creator that generates a new quiz. Now that you have written code to collect an array of all the cardIds created whenever the new quiz form is submitted, replace the empty array with this array of cardIds.

To test that your code is working, create a new quiz with some cards. Navigate to that quiz from the /quizzes page, and verify that your cards show up. Flip them over by clicking on them to make sure that you’ve correctly captured all of the state belonging to each card.

## Task 17.

Now that you can add new cards, you’ll need to display cards on the individual quiz page. The Quiz component renders a list of Card components, so in src/features/cards/Card.js, import your cards selector and use it to access all the cards in state.

## Task 18.