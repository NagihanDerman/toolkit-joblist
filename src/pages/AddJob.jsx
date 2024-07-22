import { v4 } from "uuid";
import AutoInput from "../components/AutoInput";
import Button from "../components/Button";
import Select from "../components/Select";
import { statusOpt, typeOpt } from "../utils/constants";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { createJob } from "../redux/slices/jobSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AddJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // formData oluştur
    const formData = new FormData(e.target);

    // inputlardaki verilerden bir nesne oluştur
    const newJob = Object.fromEntries(formData.entries());

    // tarih ve id ekle
    newJob.id = v4();
    newJob.date = Date.now();

    // api'a yeni veriyi kaydet
    api
      .post("/jobs", newJob)
      // istekten olumlu cevap dönerse:
      .then(() => {
        // store'a yeni veriyi kaydet
        dispatch(createJob(newJob));
        toast.success("New application added");

        // anasayfaya yönlendir
        navigate("/");
      })
      // hata dönderse: bildir
      .catch(() => toast.error("An error occurred"));
  };

  return (
    <div className="add-page">
      <section className="container">
        <h2>Add New Job</h2>

        <form onSubmit={handleSubmit}>
          <AutoInput label="Position" name="position" />
          <AutoInput label="Company" name="company" />
          <AutoInput label="Location" name="location" />

          <Select label="Status" name="status" options={statusOpt} />
          <Select label="Type" name="type" options={typeOpt} />

          <div>
            <Button text="Create" />
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddJob;
