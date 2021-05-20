import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import Articles, { imageEncoder } from '../modules/Articles';

const emptyArticle = {
  title: '',
  teaser: '',
  body: '',
  category: '',
};
const categories = [
  { key: 'HW', text: 'Hollywood', value: 'Hollywood' },
  { key: 'UFO', text: 'Aliens', value: 'Aliens' },
  { key: 'ILU', text: 'Illuminati', value: 'Illuminati' },
  { key: 'POL', text: 'Politics', value: 'Politics' },
  { key: 'COV', text: 'Covid', value: 'Covid' },
  { key: 'SC', text: 'Science', value: 'Science' },
];

const EditorialForm = ({ isCreateMode }) => {
  const [article, setArticle] = useState(emptyArticle);
  const [originalArticle, setOriginalArticle] = useState({});
  const [thumbnail, setThumbnail] = useState();
  let location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line
    !isCreateMode && getArticle();
  }, [isCreateMode]);

  const getArticle = async () => {
    let response = await Articles.show(location.state.id);
    if (response) {
      setArticle(response);
      setOriginalArticle(response);
    }
  };

  const handleSubmit = async () => {
    if (isCreateMode) {
      Articles.create(article);
    } else {
      if (article === originalArticle) {
        // raise error
      } else {
        Articles.update(article);
      }
    }
  };

  const handleChange = (event) => {
    setArticle({
      ...article,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeCategory = (event) => {
    setArticle({
      ...article,
      category: event.target.textContent,
    });
  };

  const handleImage = async (event) => {
    let file = event.target.files[0];
    setThumbnail(file);
    let encodedFile = await imageEncoder(file);
    setArticle({
      ...article,
      image: encodedFile,
    });
  };

  return (
    <div style={styles.container} className='box-shadow'>
      <Form
        style={styles.form}
        data-cy='article-form'
        inverted
        onSubmit={handleSubmit}>
        <Form.Group
          style={{
            padding: '10px 0',
            margin: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Form.Field widths={5}>
            <Form.Input
              style={{ width: 400, marginBottom: 10 }}
              required
              fluid
              onChange={(event) => handleChange(event)}
              value={article.title}
              label='Title'
              name='title'
              placeholder='Title'
              data-cy='title'
            />
            <Form.Select
              style={{ marginBottom: 10 }}
              required
              data-cy='categories'
              fluid
              onChange={(event) => handleChangeCategory(event)}
              value={article.category}
              name='category'
              label='Category'
              options={categories}
              placeholder='Category'
            />
            <Form.Input
              type='file'
              label='Image'
              name='image'
              data-cy='image'
              required={originalArticle ? false : true}
              onChange={(event) => handleImage(event)}
            />
          </Form.Field>
          <div style={{ marginRight: 50 }}>
            {article.image ? (
              <img
                data-cy='thumbnail'
                src={thumbnail ? URL.createObjectURL(thumbnail) : article.image}
                alt='thumbnail'
                style={styles.thumbnail}
              />
            ) : (
              <div style={styles.thumbnailPlaceholder}>
                <p style={{ fontSize: 20, color: 'white' }}>Thumbnail</p>
              </div>
            )}
          </div>
        </Form.Group>
        <Form.Group grouped style={{ padding: 10 }}>
          <Form.TextArea
            required
            onChange={(event) => handleChange(event)}
            value={article.teaser}
            label='Teaser'
            name='teaser'
            placeholder='Teaser'
            data-cy='teaser'
            style={{ marginBottom: 15 }}
          />
          <Form.TextArea
            required
            onChange={(event) => handleChange(event)}
            label='Main Text'
            value={article.body}
            name='body'
            placeholder='Article Body'
            data-cy='body'
            style={{ marginBottom: 15, height: 250 }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Button type='submit' data-cy='submit-btn'>
            Submit
          </Form.Button>
          <Link to='/'>
            <Form.Button
              type='submit'
              data-cy='submit-btn'
              style={{ marginLeft: 25 }}>
              Cancel
            </Form.Button>
          </Link>
        </Form.Group>
      </Form>
    </div>
  );
};

export default EditorialForm;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 100,
    marginLeft: 350,
    marginRight: 100,
    backgroundColor: '#333',
    padding: 25,
  },
  form: {
    width: '100%',
  },
  thumbnailPlaceholder: {
    display: 'flex',
    width: 300,
    height: 190,
    padding: '0 35px',
    border: '3px solid #2b2b2b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    objectFit: 'cover',
    width: 300,
    height: 190,
    padding: '0 35px',
  },
};
