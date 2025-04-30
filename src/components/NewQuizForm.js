import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
import { selectTopics } from "../features/topics/topicsSlice";
import { addQuiz } from "../features/quizzes/quizzesSlice";
import { addQuizId } from "../features/topics/topicsSlice";
import { addCard } from "../features/cards/cardsSlice";

export default function NewQuizForm() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();
  const topics = useSelector(selectTopics);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0 || !topicId || cards.length === 0) {
      return;
    }

    const quizId = uuidv4();
    const cardIds = [];

    // Create cards and collect their IDs
    cards.forEach((card) => {
      const cardId = uuidv4();
      dispatch(addCard({
        id: cardId,
        front: card.front,
        back: card.back
      }));
      cardIds.push(cardId);
    });

    // Create the quiz with the array of card IDs
    dispatch(addQuiz({
      id: quizId,
      name: name,
      topicId: topicId,
      cardIds: cardIds // Now passing the actual card IDs array
    }));

    // Associate quiz with its topic
    dispatch(addQuizId({
      quizId: quizId,
      topicId: topicId
    }));

    navigate(ROUTES.quizzesRoute());
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
          required
        />
        <select
          id="quiz-topic"
          onChange={(e) => setTopicId(e.currentTarget.value)}
          value={topicId}
          required
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
              value={card.front}
              onChange={(e) => updateCardState(index, "front", e.currentTarget.value)}
              placeholder="Front"
              required
            />
            <input
              id={`card-back-${index}`}
              value={card.back}
              onChange={(e) => updateCardState(index, "back", e.currentTarget.value)}
              placeholder="Back"
              required
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