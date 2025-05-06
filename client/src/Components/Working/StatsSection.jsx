import React from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";

const stats = [
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGzSURBVHgB7ZgxU8JAEIVfGDqtSU8t1trTaw2dhZ0FnRZWFlrpr4CaH4C11tDTh54a34578SZcTLKTY5jRb+ZmuSUhL5d3excSBNjtdiOGMdpnmiTJrJjs4AjoluQ3bEu0zwb//EJSTNCUA4YB4rGmOT9RJoICbhmuEJ8ZhUxdp+MJSA8kQBjxej3X8WdHz/u80NY2Q22C3PSmKMIn43CtUIH6J214/B5dGOCPnTA8wjMwc2K2V4rZoiHWijlWAXLBpcYLGD1lFXGmUe78gfFJ+0MYsIo41bgtRBMmT5APtmu2Cb0ghnTeqDRnmyJkOb7E98xINZexTWHAJEJnwA1HQczYR6AURxfhIcO/xqE9oQVHZoErVC6fqahFncJlEqFrywTlK6zzx1AF3VNMrU1Mk5F41ovI0M+hj8JVyMAIvTB3V6eC1hKhBvRnwbk2+a7sNDlezntHGyLwU5yEPlqmrggZ+jc0p5ZBy0SkgWU3Q3NSNXTeR4UI38n+5iMW+U3lCxhdbC67Bub+9A3ttl0pjsWqaTH7OyShJB9JLGPKurK3iy+borL9j/EWFnzJPoq/Br4AcIuMd6kaxikAAAAASUVORK5CYII=",
    number: "10+",
    label: "INSTRUCTORS",
    sublabel: "ONBOARD",
  },
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEZSURBVHgB7Ze/DoIwEMavhEl33d31KdxlZ8bdzVcRZ3fZ2X0AdnbcccXvomcq4V8xgon9JU0vhbbf9Qq5I7I8UOWBoihm6OZkTqaUulIPVEnADt2a+nOEkDMZ4mgC1h8KYAKsMyVDXM1eajZ7k1N3Vtr8BVrCBgRt0F3awuTWjEcm8cVmRO9OCFs0H8/3WC+tm+/Q9+Hw+E0vDCGCmYjBdw/NoxFE6PAvIHh+CKOJEJa/IOKFFSFYEYIVIVgRghUh/L2IhEYUwRnbCZlWLAMuDcNNDH1zYYiT4IT50PRC3UlskPmYZttVhGgxvM+7iuCLIimXR/3JxMDmUZcJjjaBY2VcPWmwt2GfUrCqFuXixbiKAmnbsVvauAPLa0cseH1WXgAAAABJRU5ErkJggg==",
    number: "20+",
    label: "ONGOING",
    sublabel: "COURSES",
  },
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIaSURBVHgBrVehUgMxEE06KOpbX38eTz8AhWg1KJihrp+AouIcncFdRRUGh+d8/Xnqq8s+usdc091L9uib2Um7yeZtNptszrsO2O/3I2ruSQYkW5IX7/3WGeGdEUQ8pCYn6TfUO5IHqwM9Z8d1QOz4/9gZIZIjrCR9xcaqx3yZSyHn/XyGKA6UTkapEM94rnErOZOBGO1IcoD2dUNNEcxTsF4irklnYQS8YDChZtpQVSRzmnwXjEPiIdursE8gBj5p3KKV3OKAhhRilfw/DqQSt5J3ccBCDLSeczJcuePkGrJIxJmFOBmIAMmaj2HbuDHJB0cgCs9GWA28viQplWMzJP13bEJEQLFHZK7c4SpGVLZeuatX1Fm4M4E4kDeThgoOzEGOS0W6/m5Tj1aEGIt7E7o2SLiBYte6vwZo8w9ArpXB6P4motLmB/mrO+xBE0WXx4EE3rowf6BbNLO9rtMn2c7FBdleRbgwFhm9EWpBne1Y1FfS4kBMkhvPed7yHvhD7HqtS2yT9FGKADuWN1TRWtAzEhda6Fnf3FvxPXBkYyReuQgsxcifk9jqQK8rMSdiRnJyiQjVUNyCi8AuLJka8dFdTf9PagHsSI+f02Bu/bjys3nNoZP6Mz5OoWTKeLUcqwnX8lq5o+ZG6Honm6ViI5Zj8ahFqpl2M6k22jugy+dSKRD9PhCcEeYPRYBrwZM7JBBWtUy590P8AAmWd8T+jb4gAAAAAElFTkSuQmCC",
    number: "200+",
    label: "ENROLLED",
    sublabel: "STUDENTS",
  },
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHbSURBVHgB7ZevU8MwFMdfuLrh8XjQzNfjN49mDv4D3DTzrQZfz/Tq8UVTXd5LX3a5XNK0SdOb4Hv3LlubJp/mx/elABHquu4WZpKAACHAHRZbDCobjFIIUUGEJoEYAKaigEaBeABmARKBAC3GB8Ynxhpjg3ETAyRCAbCD1ngmjwESsQCWlwgCEvwwbcMnsK+BmiEGASzKOcACdECgow1k53golU4I8qpfuIILUcZlDcuqgX955PIR2kUP/LfGhVVb6jxisZKNCFGGtKErc1ynRrb8uwD7GiIQ5RVlYBtnXcyuWQrEa4YZpNUJelv32kNKkK8pR4FkIHpy1JIpGVmB935gKRADQCVTKnO8XplASUBGnOhyEyjVrvEdK1sNSHqNa4Fole/597ejzgHjGqaLzI2OmG/Qmx44QXCoaFENZkjzYDMgakc5cKHSAU7L0QsyoyrseM8Hr0aDoOnY6BUzvkF5Yw1xqjTf+OVSGhnBqEoWiOYMAv0QjflmGRI1qEBoXdGL7bBjUIC2keC6s06N/h2sW7qEgX6dbCzPSZCgb98xws5pV/hGuVLTljL7UgdDWVfavfqTDIQt4MUBI+/pFp9sapRwimhtPGPc8yXyj3db4ltEBISxct3/A42fyevZ/mMpAAAAAElFTkSuQmCC",
    number: "2+",
    label: "YEARS",
    sublabel: "WORKING SINCE",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function StatsSection() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-[#16215c] pb-10 lg:pb-24 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 px-5 "
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </motion.div>
  );
}

export default StatsSection;
