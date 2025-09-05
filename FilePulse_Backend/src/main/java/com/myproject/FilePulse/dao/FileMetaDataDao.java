package com.myproject.FilePulse.dao;

import com.myproject.FilePulse.model.FileMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileMetaDataDao extends JpaRepository<FileMetaData, Integer> {

    List<FileMetaData> findByClerkId(String clerkId);

    Long countByClerkId(String clerkId);
}
