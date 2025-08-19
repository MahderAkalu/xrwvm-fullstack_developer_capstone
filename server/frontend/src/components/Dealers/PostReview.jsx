import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = `${root_url}djangoapp/dealer/${id}`;
  let review_url = `${root_url}djangoapp/add_review`;
  let carmodels_url = `${root_url}djangoapp/get_cars`;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");

    // If the first and second name are stored as null, use the username
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        alert("Review posted successfully!");
        window.location.href = `${window.location.origin}/dealer/${id}`; // Redirect after successful post
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Failed to post review.");
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) {
        setDealer(dealerobjs[0]);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = Array.from(retobj.CarModels);
    setCarmodels(carmodelsarr);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            id='review'
            cols='50'
            rows='7'
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <div className='input_field'>
            Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className='input_field'>
            Car Make 
            <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)} required>
              <option value="" disabled hidden>Choose Car Make and Model</option>
              {carmodels.map(carmodel => (
                <option key={carmodel.CarModel} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                  {carmodel.CarMake} {carmodel.CarModel}
                </option>
              ))}
            </select>        
          </div>
          <div className='input_field'>
            Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} required />
          </div>
          <div>
            <button type='submit' className='postreview'>Post Review</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostReview;