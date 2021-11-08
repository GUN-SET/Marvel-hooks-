import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';


import './comicsList.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import useMarvelService from "../../services/useMarvelService";
import {Link} from "react-router-dom";

const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {error, loading, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(NewItemLoading => false)
        setOffset(offset => offset + 8)
        setComicsEnded(comicsEnded => ended)
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('comics__item_selected'));
        itemRefs.current[id].classList.add('comics__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации,
    // чтобы не помещать такую конструкцию в метод render
    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
           return (
               <li className="comics__item" key={i}>
                   <Link to={`/comics/${item.id}`}>
                       <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                       <div className="comics__item-name">{item.title}</div>
                       <div className="comics__item-price">{item.price}</div>
                   </Link>
               </li>
           )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
};

export default ComicsList;