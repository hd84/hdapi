CREATE DEFINER=`root`@`%` FUNCTION `create_random_key`(`p_length` INT, `p_include_upper_case` BOOLEAN, `p_include_lower_case` BOOLEAN, `p_include_number` BOOLEAN, `p_first_block_type` TINYINT(2))
    RETURNS varchar(255) CHARSET utf8
    LANGUAGE SQL
    NOT DETERMINISTIC
    CONTAINS SQL
    SQL SECURITY DEFINER
    COMMENT '렌덤키를 생성'
BEGIN
/** 2014.05.25 - opal95 : create random key
 * IN
 * - p_length : key total length
 * - p_include_upper_case : 대문자 포함여부
 * - p_include_lower_case : 소문자 포함여부
 * - p_include_number : 숫자 포함여부
 * - p_first_block_type : 첫번째 문자 불가유형(0:미적용, 1:'0'안됨, 2:숫자안됨)
 * RETURN : 조합된 키값
**/
 
/* Define */
DECLARE v_return_key                    VARCHAR(255) DEFAULT '';
DECLARE v_char_store                    CHAR(1) DEFAULT '';
DECLARE v_done                                INT DEFAULT 0;
 
/* Create Temporary Table */
DROP TEMPORARY TABLE IF EXISTS temp_random_key;
CREATE TEMPORARY TABLE temp_random_key(
    random_char CHAR(1),
    type TINYINT(2)
);
IF p_include_upper_case = true THEN
    INSERT INTO temp_random_key (random_char, type) VALUES
        /* upper case - 26 */
        ('A', 1),('B', 1),('C', 1),('D', 1),('E', 1),('F', 1),('G', 1),('H', 1),('I', 1),('J', 1),
        ('K', 1),('L', 1),('M', 1),('N', 1),('O', 1),('P', 1),('Q', 1),('R', 1),('S', 1),('T', 1),('U', 1),('V', 1),('W', 1),('X', 1),('Y', 1),('Z', 1);
END IF;
IF p_include_lower_case = true THEN
    INSERT INTO temp_random_key (random_char, type) VALUES
        /* lower case - 26 */
        ('a', 2),('b', 2),('c', 2),('d', 2),('e', 2),('f', 2),('g', 2),('h', 2),('i', 2),('j', 2),
        ('k', 2),('l', 2),('m', 2),('n', 2),('o', 2),('p', 2),('q', 2),('r', 2),('s', 2),('t', 2),('u', 2),('v', 2),('w', 2),('x', 2),('y', 2),('z', 2);
END IF;
IF p_include_number = true THEN
    INSERT INTO temp_random_key (random_char, type) VALUES
        /* number - 10 */
        ('0', 3),('1', 3),('2', 3),('3', 3),('4', 3),('5', 3),('6', 3),('7', 3),('8', 3),('9', 3);
END IF;
 
/* Select Random_character */
/* - The first character is not zero */
IF p_first_block_type = 1 THEN
    SELECT random_char INTO v_return_key FROM temp_random_key WHERE random_char <> '0' ORDER BY rand() LIMIT 1;
    SET p_length = p_length - 1;
/* - The first character is not number */
ELSEIF p_first_block_type = 2 THEN
    SELECT random_char INTO v_return_key FROM temp_random_key WHERE type in (1, 2) ORDER BY rand() LIMIT 1;
    SET p_length = p_length - 1;
END IF;
/* - The remaining character */
WHILE p_length DO
    SELECT random_char INTO v_char_store FROM temp_random_key ORDER BY rand() LIMIT 1;
    SET v_return_key = CONCAT(v_return_key, v_char_store);
    SET p_length = p_length - 1;
END WHILE;
 
/* Return Key */
RETURN v_return_key;