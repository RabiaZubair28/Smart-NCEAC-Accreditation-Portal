import React, { useState } from "react";
import axios from "axios";

const Batches = () => {
  const [batchName, setBatchName] = useState("");
  const [numberOfSections, setNumberOfSections] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!batchName || !numberOfSections) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://iba-nceac.site/api/batches/create-batch",
        {
          batchName,
          numberOfSections: parseInt(numberOfSections, 10),
        }
      );

      setMessage(response.data.message);
      setBatchName("");
      setNumberOfSections("");
    } catch (error) {
      setMessage("Error creating batch.");
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Create a New Batch</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Batch Name: </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Enter batch name"
            required
          />
        </div>

        <div>
          <label>Number of Sections: </label>
          <input
            type="number"
            value={numberOfSections}
            onChange={(e) => setNumberOfSections(e.target.value)}
            placeholder="Enter number of sections"
            required
          />
        </div>

        <button type="submit">Create Batch</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Batches;
