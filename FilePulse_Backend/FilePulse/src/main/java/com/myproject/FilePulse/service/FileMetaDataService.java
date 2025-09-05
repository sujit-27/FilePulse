package com.myproject.FilePulse.service;

import com.myproject.FilePulse.dao.FileMetaDataDao;
import com.myproject.FilePulse.dto.FileMetaDataDto;
import com.myproject.FilePulse.model.FileMetaData;
import com.myproject.FilePulse.model.Profile;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {

    @Autowired
    private  ProfileService profileService;

    @Autowired
    private UserCreditsService userCreditsService;

    @Autowired
    private FileMetaDataDao repo;

    public List<FileMetaDataDto> uploadFiles(MultipartFile files[]) throws IOException {
        Profile currentProfile = profileService.getCurrentProfile();
        List<FileMetaData> savedFiles = new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not enough credits to upload files. Please purchase for credits");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for(MultipartFile file : files){
            String fileName = UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation , StandardCopyOption.REPLACE_EXISTING);

            FileMetaData fileMetaData = new FileMetaData();

            fileMetaData.setFileLocation(targetLocation.toString());
            fileMetaData.setName(file.getOriginalFilename());
            fileMetaData.setSize(file.getSize());
            fileMetaData.setType(file.getContentType());
            fileMetaData.setClerkId(currentProfile.getClerkId());
            fileMetaData.setPublic(false);
            fileMetaData.setUploadedAt(LocalDateTime.now());

            userCreditsService.consumeCredit();

            savedFiles.add(repo.save(fileMetaData));

        }

        return savedFiles.stream().map(fileMetaData -> mapToDto(fileMetaData))
                .collect(Collectors.toList());
    }

    private FileMetaDataDto mapToDto(FileMetaData fileMetaData){
        FileMetaDataDto fileMetaDataDto = new FileMetaDataDto();

        fileMetaDataDto.setId(fileMetaData.getId());
        fileMetaDataDto.setFileLocation(fileMetaData.getFileLocation());
        fileMetaDataDto.setName(fileMetaData.getName());
        fileMetaDataDto.setSize(fileMetaData.getSize());
        fileMetaDataDto.setType(fileMetaData.getType());
        fileMetaDataDto.setClerkId(fileMetaData.getClerkId());
        fileMetaDataDto.setPublic(fileMetaData.getPublic());
        fileMetaDataDto.setUploadedAt(LocalDateTime.now());

        return fileMetaDataDto;
    }

    public List<FileMetaDataDto> getFiles(){
        Profile currentProfile = profileService.getCurrentProfile();

        List<FileMetaData> files = repo.findByClerkId(currentProfile.getClerkId());

        return files.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public FileMetaDataDto getPublicFile(int id){
        Optional<FileMetaData> fileOptional = repo.findById(id);

        if(fileOptional.isEmpty() || !fileOptional.get().getPublic()){
            throw new RuntimeException("Unable to get the file!");
        }

        FileMetaData data = fileOptional.get();

        return mapToDto(data);
    }

    public FileMetaDataDto getDownloadableFile(int id){
        FileMetaData file = repo.findById(id).orElseThrow(() -> new RuntimeException("File Not Found"));
        return mapToDto(file);
    }

    public void deleteFile(int id){
        try{
            Profile currentProfile = profileService.getCurrentProfile();
            Optional<FileMetaData> optionalFile = repo.findById(id);
            FileMetaData file = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            if(!file.getClerkId().equals(currentProfile.getClerkId())){
                throw new RuntimeException("File does not belong to current User");
            }

            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);

            repo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting the file");
        }
    }

    @Transactional
    public FileMetaDataDto togglePublic(int id){
        FileMetaData file = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setPublic(!file.getPublic());
        repo.save(file);
        return mapToDto(file);
    }


}
