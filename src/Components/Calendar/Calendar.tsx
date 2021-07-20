const request = require('cloudscraper')
import React, { useEffect,useState } from 'react'
import './scss/calendar.global.scss'
// let defaultItems = request.get("https://sneakernews.com/wp-admin/admin-ajax.php?action=release_date_load_more&nextpage=0&category_name=sneaker-release&start_from=0",{
//   headers:request.defaultParams.headers
// }).then(
//   (response:string)=>{
//     let Items = []
//     let doc = new DOMParser().parseFromString(response,'text/html')
//     doc.querySelectorAll('.releases-box[id]').forEach((element:any)=>{
//       Items=[...Items,element.querySelector('img').src]
//     })
//     return Items
//   }
// )

const Calendar = () => {
  const [items, setitems] = useState<any>([])
  useEffect(()=>{
    request.get("https://sneakernews.com/wp-admin/admin-ajax.php?action=release_date_load_more&nextpage=2&category_name=sneaker-release&start_from=0",{
      headers:request.defaultParams.headers
      }).then(
      (resp:string)=>request.get("https://sneakernews.com/wp-admin/admin-ajax.php?action=release_date_load_more&nextpage=3&category_name=sneaker-release&start_from=0",{
        headers:request.defaultParams.headers
        }).then((response:string)=>{
        response = resp+response
        let Items = []
        let doc = new DOMParser().parseFromString(response,'text/html')
        doc.querySelectorAll('.releases-box[id]').forEach((element:any)=>{
          Items=[...Items,{
            img:element.querySelector('img').src,
            price:element.querySelector('.release-price').textContent.replace(/\s+/g," ").trim(),
            date:element.querySelector('.release-date').textContent.replace(/\s+/g," ").trim(),
            name:element.querySelector('.content-box').querySelector('h2').querySelector('a').textContent.replace(/\s+/g," ").trim(),
            sizes:element.querySelector('.post-data').querySelectorAll('p')[0].textContent.replace(/\s+/g," ").trim(),
            color:element.querySelector('.post-data').querySelectorAll('p')[1].textContent.replace(/\s+/g," ").trim(),
            styleCode:element.querySelector('.post-data').querySelectorAll('p')[2].textContent.replace(/\s+/g," ").trim(),
            regions:element.querySelector('.post-data').querySelectorAll('p')[3].textContent.replace(/\s+/g," ").trim(),
          }]
        })
        return setitems(Items)

      })
    ).catch(()=>{})
    },[])
    return (
<div className="tab-pane fade" id="v-pills-calendar" role="tabpanel" aria-labelledby="v-pills-calendar-tab">
  <div className="container">
    <div className="row g-4">
      {/* <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div> */}
      {items.map((element:any)=>      <div className="col-4">
        <div className="p-3 custom-corners custom_card">
          <img src={element.img} className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">{element.date}</h3>
            <h6 id="сolorName">{element.name}</h6>
            <h4 id="price">{element.price}</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">{element.styleCode}</h5>
            <br />
            <h5 id="region">{element.regions}</h5>
          </div>
        </div>
      </div>
)}
      {/* <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="p-3 custom-corners">
          <img src="./images/foam rnr blue.png" className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">05.29</h3>
            <h6 id="сolorName">YEEZY Foam Runner “Mineral Blue”</h6>
            <h4 id="price">$ 80</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">Style Code:GV7903</h5>
            <br />
            <h5 id="region">Region:US, Europe, Asia</h5>
          </div>
        </div>
      </div> */}
      {/* <div className="container">
        <h5 className="col text-center text-light miniInfo">
          Информация была взята с сайта Sneaker News
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
          </svg>
        </h5>
      </div> */}
    </div>
  </div>
</div>
    )
}

export default Calendar
