import React, { useEffect, useRef, useState } from "react";
import Select from "./Select";
import { sortOpt, statusOpt, typeOpt } from "./../utils/constants";
import Button from "./Button";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setError, setJobs, setLoading } from "../redux/slices/jobSlice";

const Filter = () => {
  const [text, setText] = useState();
  const [debouncedText, setDebouncedText] = useState();
  const [sort, setSort] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState();

  const dispatch = useDispatch();

  //*  DEBOUNCE

  useEffect(() => {
    if (text === undefined) return;

    // bir sayaç başlat ve sayaç durunca işlem yap
    const timer = setTimeout(() => setDebouncedText(text), 500);

    // eğerki süre bitmeden tekrar useEffext çalışırsa (yeni sayaç başlaması) önceki sayacı iptal et
    return () => clearTimeout(timer);
  }, [text]);

  // filtreleme veya sıralama için bi state değiştiğinde api'dan güncel verileri al
  useEffect(() => {
    const sortP =
      sort === "a-z" || sort === "z-a"
        ? "company"
        : sort === "En Yeni" || sort === "En Eski"
        ? "date"
        : undefined;

    const orderP =
      sort === "a-z" || sort === "En Eski"
        ? "asc"
        : sort === "z-a" || sort === "En Yeni"
        ? "desc"
        : undefined;

    const params = {
      q: debouncedText,
      status: status || undefined,
      type: type || undefined,
      _sort: sortP,
      _order: orderP,
    };

    dispatch(setLoading());

    api
      .get("/jobs", { params })
      .then((res) => dispatch(setJobs(res.data)))
      .catch((err) => dispatch(setError(err.message)));
  }, [debouncedText, status, sort, type]);

  // bütün stateleri sıfırla
  const handleReset = () => {
    setDebouncedText();
    setText();
    setType();
    setStatus();
    setSort();
  };

  return (
    <div className="filter-sec">
      <h2> Filter Form</h2>

      <form onReset={handleReset}>
        <div>
          <label>Search</label>
          <input onChange={(e) => setText(e.target.value)} type="text" />
        </div>

        <Select
          label="Status"
          options={statusOpt}
          fn={(e) => setStatus(e.target.value)}
        />
        <Select
          label="Type"
          options={typeOpt}
          fn={(e) => setType(e.target.value)}
        />
        <Select
          label="Sort"
          options={sortOpt}
          fn={(e) => setSort(e.target.value)}
        />

        <Button type="reset" text="Reset Filters" />
      </form>
    </div>
  );
};

export default Filter;
