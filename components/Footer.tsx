import { NextPage } from 'next'
import React from 'react'
import styles from "styles/components/footer/Footer.module.scss"
import FooterImageCarousel from './FooterImageCarousel'

type Props = {}

const Footer: NextPage<Props> = (props: Props) => {
    return (
        <footer id="footer" className={styles.FooterWrapper}>
            <FooterImageCarousel lengthToSwitch={5} imgPaths={[{imgPath:"orli.png",link:"https://google.com"}, {imgPath:"_89716241_thinkstockphotos-523060154.jpg", link:"https://youtube.com"}, {imgPath:"orli.png",link:"https://reddit.com"}]}></FooterImageCarousel>
        </footer>
    )
}

export default Footer